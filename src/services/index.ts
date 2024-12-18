import { AIModelManagementService } from './ai/model-management.service';
import { Container } from 'typedi';
import { PerformanceDashboardService } from './monitoring/performance-dashboard.service';
import { UserExperienceService } from './enhancement/user-experience.service';
import { UserGrowthService } from './UserGrowthService';

// 注册所有服务
export const registerServices = (container: Container) => {
  // 注册AI服务
  container.register('AIModelManagementService', {
    useClass: AIModelManagementService,
  });

  // 注册监控服务
  container.register('PerformanceDashboardService', {
    useClass: PerformanceDashboardService,
  });

  // 注册用户体验服务
  container.register('UserExperienceService', {
    useClass: UserExperienceService,
  });

  // 注册用户成长服务
  container.register('UserGrowthService', {
    useClass: UserGrowthService,
  });
};

// 导出所有服务
export * from './auth.service';
export * from './family.service';
export * from './reward.service';
export * from './health.service';
export * from './user.service';
export * from './UserGrowthService';
export * from './ai/model-management.service';
export * from './monitoring/performance-dashboard.service';
export * from './enhancement/user-experience.service';

// 导出服务类型
export interface IBaseService {
  /** init 的描述 */
    init: Promisevoid;
  /** validatedata 的描述 */
    validatedata: any: /** Promiseboolean 的描述 */
    /** Promiseboolean 的描述 */
    Promiseboolean;
  /** handleErrorerror 的描述 */
    handleErrorerror: Error: /** void 的描述 */
    /** void 的描述 */
    void;
}

// 导出服务常量
export const SERVICE_TOKENS = {
  AUTH: 'AUTH_SERVICE',
  USER: 'USER_SERVICE',
  HEALTH: 'HEALTH_SERVICE',
  FAMILY: 'FAMILY_SERVICE',
  REWARD: 'REWARD_SERVICE',
  USER_GROWTH: 'USER_GROWTH_SERVICE',
  AI_MODEL: 'AI_MODEL_SERVICE',
  PERFORMANCE: 'PERFORMANCE_SERVICE',
  USER_EXPERIENCE: 'USER_EXPERIENCE_SERVICE',
} as const;

// 导出服务类型
export type ServiceTokenType = any;
