// 紧急救助类型定义
interface EmergencyTypes {
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