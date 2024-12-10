const { MongoClient } = require('mongodb');
const { expect } = require('chai');

describe('数据库性能测试', () => {
    let client;
    let db;

    before(async () => {
        client = await MongoClient.connect(process.env.MONGODB_URI);
        db = client.db('health_management');
    });

    after(async () => {
        await client.close();
    });

    it('应该高效查询用户健康记录', async () => {
        const userId = 'test_user_id';
        const startTime = new Date();
        
        const results = await db.collection('health_records')
            .find({ 
                userId,
                type: 'vital_signs',
                'data.timestamp': {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            })
            .explain('executionStats');
            
        // 验证使用了正确的索引
        expect(results.executionStats.executionTimeMillis).to.be.below(100);
        expect(results.queryPlanner.winningPlan.inputStage.indexName)
            .to.equal('user_activity_lookup');
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