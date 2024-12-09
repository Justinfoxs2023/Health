const { expect } = require('chai');
const sinon = require('sinon');
const VitalSignsService = require('../../src/services/vital-signs.service');
const CacheService = require('../../src/services/cache.service');

describe('VitalSignsService', () => {
    let vitalSignsService;
    let cacheService;

    beforeEach(() => {
        cacheService = new CacheService();
        vitalSignsService = new VitalSignsService();
    });

    describe('缓存机制测试', () => {
        it('应该正确缓存阈值配置', async () => {
            const mockThresholds = {
                heart_rate: { min: 60, max: 100 },
                blood_pressure: { systolic: { min: 90, max: 140 } }
            };
            
            // 模拟数据库查询
            sinon.stub(VitalSignsService.prototype, 'getThresholds')
                .resolves(mockThresholds);
            
            // 首次获取 - 应该从数据库读取
            const result1 = await vitalSignsService.getThresholds('heart_rate');
            expect(result1).to.deep.equal(mockThresholds);
            
            // 第二次获取 - 应该从缓存读取
            const result2 = await vitalSignsService.getThresholds('heart_rate');
            expect(result2).to.deep.equal(mockThresholds);
            
            // 验证数据库只被查询一次
            expect(VitalSignsService.prototype.getThresholds.calledOnce).to.be.true;
        });

        it('应该在缓存过期后重新获取数据', async () => {
            const clock = sinon.useFakeTimers();
            
            // 设置初始数据
            await vitalSignsService.getThresholds('heart_rate');
            
            // 推进时间超过缓存时间
            clock.tick(3600 * 1000 + 1);
            
            // 再次获取数据应该触发新的数据库查询
            await vitalSignsService.getThresholds('heart_rate');
            expect(VitalSignsService.prototype.getThresholds.calledTwice).to.be.true;
            
            clock.restore();
        });
    });
}); 