/**
 * @fileoverview TS 文件 database.types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IDatabaseModels {
  /** User 的描述 */
  User: {
    id: string;
    email: string;
    password: string;
    roles: string[];
    status: 'active' | 'locked' | 'inactive';
    profile: {
      name: string;
      avatar?: string;
      phone?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  };

  /** HealthData 的描述 */
  HealthData: {
    id: string;
    userId: string;
    type: string;
    metrics: Record<string, any>;
    timestamp: Date;
    source: string;
  };

  /** Profile 的描述 */
  Profile: {
    id: string;
    userId: string;
    healthScore: number;
    vitalSigns: {
      heartRate: number;
      bloodPressure: {
        systolic: number;
        diastolic: number;
      };
      bloodOxygen: number;
    };
    tags: string[];
    risks: Array<{
      type: string;
      level: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };

  /** Notification 的描述 */
  Notification: {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: Date;
  };
}
