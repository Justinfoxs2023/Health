export interface DatabaseModels {
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

  HealthData: {
    id: string;
    userId: string;
    type: string;
    metrics: Record<string, any>;
    timestamp: Date;
    source: string;
  };

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