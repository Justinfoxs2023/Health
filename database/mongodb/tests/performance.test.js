const { MongoClient } = require('mongodb');
const { expect } = require('chai');

describe('数据库性能测试', () => {
    let client;
    let db;
    let testData;

    before(async () => {
        client = await MongoClient.connect(process.env.MONGODB_URI);
        db = client.db('health_management');
        testData = await setupTestData(db);
    });

    after(async () => {
        await cleanupTestData(db, testData);
        await client.close();
    });

    it('应该高效查询用户健康记录', async () => {
        const userId = 'test_user_id';
        const startTime = process.hrtime();
        
        const results = await db.collection('health_records')
            .find({ 
                userId,
                type: 'vital_signs',
                'data.timestamp': {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            })
            .explain('executionStats');
            
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const executionTime = seconds * 1000 + nanoseconds / 1000000;
            
        expect(executionTime).to.be.below(50);
        expect(results.queryPlanner.winningPlan.inputStage.indexName)
            .to.equal('user_activity_lookup');
        expect(results.executionStats.nReturned).to.be.below(1000);
    });

    it('应该高效查询AI分析结果', async () => {
        const userId = 'test_user_id';
        const startTime = new Date();
        
        const results = await db.collection('ai_analysis')
            .find({
                userId,
                type: 'health_assessment',
                createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            })
            .explain('executionStats');
            
        expect(results.executionStats.executionTimeMillis).to.be.below(100);
        expect(results.queryPlanner.winningPlan.inputStage.indexName)
            .to.equal('user_analysis_lookup');
    });
});

async function setupTestData(db) {
    const testData = {
        userId: 'test_user_id',
        records: []
    };
    
    const records = generateTestHealthRecords(testData.userId, 1000);
    const result = await db.collection('health_records').insertMany(records);
    testData.records = result.insertedIds;
    
    return testData;
}

async function cleanupTestData(db, testData) {
    await db.collection('health_records').deleteMany({
        _id: { $in: Object.values(testData.records) }
    });
}

function generateTestHealthRecords(userId, count) {
    const records = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
        records.push({
            userId,
            type: 'vital_signs',
            data: {
                timestamp: new Date(now - i * 60000),
                value: Math.random() * 100
            }
        });
    }
    
    return records;
} 