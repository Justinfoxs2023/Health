/**
 * @fileoverview TS 文件 modules.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// Material UI 相关模块声明
declare module '@mui/material' {
  export { Box, Card, Grid, Typography, Button, Chip, Dialog, DialogTitle, DialogContent };

  export interface BoxProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface CardProps {
    className?: string;
    children?: React.ReactNode;
  }

  export interface GridProps {
    container?: boolean;
    item?: boolean;
    spacing?: number;
    xs?: number;
    md?: number;
    children?: React.ReactNode;
  }

  export interface TypographyProps {
    variant?: 'h6' | 'subtitle1' | 'body2';
    children?: React.ReactNode;
  }

  export interface ButtonProps {
    variant?: 'outlined' | 'contained';
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    children?: React.ReactNode;
  }

  export interface ChipProps {
    key?: string;
    label?: string;
    size?: 'small' | 'medium';
  }

  export interface DialogProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
  }
}

// 家族健康相关类型声明
declare namespace Health {
  interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    birthDate: string;
    gender: 'male' | 'female';
    healthStatus: 'healthy' | 'sick' | 'deceased';
  }

  interface Reward {
    id: string;
    title: string;
    points: number;
    description: string;
    expiryDate?: string;
    claimed: boolean;
  }

  interface HealthRecord {
    id: string;
    memberId: string;
    recordType: 'diagnosis' | 'treatment' | 'medication' | 'checkup';
    date: string;
    details: {
      condition?: string;
      treatment?: string;
      medication?: string;
      dosage?: string;
      frequency?: string;
      notes?: string;
    };
  }
}

// 通用工具类型声明
declare namespace Utils {
  interface Logger {
    info(message: string, ...args: any[]): void;
    error(message: string, error?: Error): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
  }

  interface ErrorHandler {
    handle(error: Error): void;
    report(error: Error): Promise<void>;
  }

  interface Analytics {
    trackEvent(eventName: string, properties?: Record<string, any>): void;
    trackError(error: Error): void;
  }
}

// 服务相关类型声明
declare namespace Services {
  interface HealthService {
    getHealthRecords(memberId: string): Promise<Health.HealthRecord[]>;
    updateHealthRecord(record: Health.HealthRecord): Promise<void>;
    deleteHealthRecord(recordId: string): Promise<void>;
  }

  interface RewardService {
    getRewards(userId: string): Promise<Health.Reward[]>;
    claimReward(rewardId: string): Promise<void>;
    checkEligibility(userId: string, rewardId: string): Promise<boolean>;
  }
}
