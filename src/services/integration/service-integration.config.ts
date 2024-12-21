import { Injectable } from '@nestjs/common';

export interface IServiceConfig {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** version 的描述 */
    version: string;
  /** type 的描述 */
    type: core  auxiliary  integration;
  dependencies: string;
  apis: {
    key: string: {
      type: http  grpc  event;
      path: string;
      method: string;
      auth: boolean;
      rateLimit: {
        max: number;
        window: number;
      };
    };
  };
  health: {
    endpoint: string;
    interval: number;
    timeout: number;
    retries: number;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    strategy: 'memory' | 'redis';
  };
  retry?: {
    enabled: boolean;
    maxAttempts: number;
    delay: number;
    backoff: 'fixed' | 'exponential';
  };
  circuit?: {
    enabled: boolean;
    threshold: number;
    timeout: number;
    resetTimeout: number;
  };
}

export interface IntegrationRule {
  /** id 的描述 */
    id: string;
  /** name 的描述 */
    name: string;
  /** source 的描述 */
    source: string;
  /** target 的描述 */
    target: string;
  /** type 的描述 */
    type: sync  /** event 的描述 */
    /** event 的描述 */
    async  event;
  /** transform 的描述 */
    transform: {
    type: map  aggregate  enrich;
    config: any;
  };
  validation?: {
    schema: any;
    rules: Array<{
      field: string;
      type: string;
      params: any;
    }>;
  };
  error?: {
    retry: boolean;
    fallback?: string;
    alert?: boolean;
  };
}

@Injectable()
export class ServiceIntegrationConfig {
  // 核心服务配置
  readonly coreServices: IServiceConfig[] = [
    {
      id: 'health-service',
      name: '健康服务',
      version: '1.0.0',
      type: 'core',
      dependencies: ['data-service', 'ai-service'],
      apis: {
        getHealthData: {
          type: 'http',
          path: '/api/health/data',
          method: 'GET',
          auth: true,
          rateLimit: {
            max: 100,
            window: 60,
          },
        },
        updateHealthMetrics: {
          type: 'http',
          path: '/api/health/metrics',
          method: 'POST',
          auth: true,
        },
        healthEvents: {
          type: 'event',
          path: 'health.events',
        },
      },
      health: {
        endpoint: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
      },
      cache: {
        enabled: true,
        ttl: 3600,
        strategy: 'redis',
      },
      retry: {
        enabled: true,
        maxAttempts: 3,
        delay: 1000,
        backoff: 'exponential',
      },
      circuit: {
        enabled: true,
        threshold: 0.5,
        timeout: 10000,
        resetTimeout: 30000,
      },
    },
    {
      id: 'data-service',
      name: '数据服务',
      version: '1.0.0',
      type: 'core',
      dependencies: ['storage-service'],
      apis: {
        queryData: {
          type: 'grpc',
          path: '/data.service/query',
        },
        streamData: {
          type: 'grpc',
          path: '/data.service/stream',
        },
      },
      health: {
        endpoint: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3,
      },
      cache: {
        enabled: true,
        ttl: 1800,
        strategy: 'memory',
      },
    },
  ];

  // 集成规则配置
  readonly integrationRules: IntegrationRule[] = [
    {
      id: 'health-data-sync',
      name: '健康数据同步',
      source: 'health-service',
      target: 'data-service',
      type: 'sync',
      transform: {
        type: 'map',
        config: {
          mappings: [
            { from: 'healthMetrics', to: 'metrics' },
            { from: 'timestamp', to: 'recordedAt' },
          ],
        },
      },
      validation: {
        schema: {
          type: 'object',
          properties: {
            metrics: {
              type: 'object',
              required: true,
            },
            recordedAt: {
              type: 'string',
              format: 'date-time',
              required: true,
            },
          },
        },
        rules: [
          {
            field: 'metrics',
            type: 'object',
            params: {
              required: ['heartRate', 'bloodPressure'],
            },
          },
        ],
      },
      error: {
        retry: true,
        fallback: 'health-data-backup',
        alert: true,
      },
    },
    {
      id: 'social-health-integration',
      name: '社交健康整合',
      source: 'social-service',
      target: 'health-service',
      type: 'async',
      transform: {
        type: 'enrich',
        config: {
          enrichments: [
            {
              type: 'social_context',
              fields: ['activities', 'connections', 'support_network'],
            },
          ],
        },
      },
      validation: {
        schema: {
          type: 'object',
          properties: {
            socialContext: {
              type: 'object',
              required: true,
            },
          },
        },
        rules: [
          {
            field: 'socialContext',
            type: 'object',
            params: {
              required: ['activities', 'connections'],
            },
          },
        ],
      },
      error: {
        retry: true,
        alert: true,
      },
    },
  ];

  // 获取服务配置
  getServiceConfig(serviceId: string): IServiceConfig | undefined {
    return this.coreServices.find(service => service.id === serviceId);
  }

  // 获取服务依赖
  getServiceDependencies(serviceId: string): string[] {
    const service = this.getServiceConfig(serviceId);
    return service ? service.dependencies : [];
  }

  // 获取集成规则
  getIntegrationRule(ruleId: string): IntegrationRule | undefined {
    return this.integrationRules.find(rule => rule.id === ruleId);
  }

  // 获取服务API配置
  getServiceApi(serviceId: string, apiName: string): any {
    const service = this.getServiceConfig(serviceId);
    return service?.apis[apiName];
  }

  // 验证服务依赖
  validateDependencies(serviceId: string): boolean {
    const service = this.getServiceConfig(serviceId);
    if (!service) return false;

    return service.dependencies.every(depId => this.coreServices.some(s => s.id === depId));
  }

  // 检查循环依赖
  checkCircularDependencies(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (serviceId: string): boolean => {
      visited.add(serviceId);
      recursionStack.add(serviceId);

      const dependencies = this.getServiceDependencies(serviceId);
      for (const depId of dependencies) {
        if (!visited.has(depId)) {
          if (hasCycle(depId)) return true;
        } else if (recursionStack.has(depId)) {
          return true;
        }
      }

      recursionStack.delete(serviceId);
      return false;
    };

    return this.coreServices.some(service => !visited.has(service.id) && hasCycle(service.id));
  }
}
