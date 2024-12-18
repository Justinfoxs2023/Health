/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 紧急救助类型定义
interface IEmergencyTypes {
  // 紧急联系人
  EmergencyContact {
    id: string;
    name: string;
    phone: string;
    priority: number;
    relationship: string;
    notificationPreference: NotificationType[];
  }

  // 紧急事件
  EmergencyEvent {
    id: string;
    type: EmergencyType;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    timestamp: number;
    status: 'active' | 'resolved';
  }
} 