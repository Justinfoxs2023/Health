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
    className: string;
    children: ReactReactNode;
  }

  export interface CardProps {
    className: string;
    children: ReactReactNode;
  }

  export interface GridProps {
    container: boolean;
    item: boolean;
    spacing: number;
    xs: number;
    md: number;
    children: ReactReactNode;
  }

  export interface TypographyProps {
    variant: h6  subtitle1  body2;
    children: ReactReactNode;
  }

  export interface IButtonProps {
    /** variant 的描述 */
      variant: outlined  /** contained 的描述 */
      /** contained 的描述 */
      contained;
    /** size 的描述 */
      size: small  medium  large;
    onClick:   void;
    children: ReactReactNode;
  }

  export interface IChipProps {
    /** key 的描述 */
      key: string;
    /** label 的描述 */
      label: string;
    /** size 的描述 */
      size: small  /** medium 的描述 */
      /** medium 的描述 */
      medium;
  }

  export interface IDialogProps {
    /** open 的描述 */
      open: false | true;
    /** onClose 的描述 */
      onClose:   void;
    /** children 的描述 */
      children: ReactReactNode;
  }
}

// 家族健康相关类型声明
declare namespace Health {
  interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    birthDate: string;
    gender: male  female;
    healthStatus: healthy  sick  deceased;
  }

  interface IReward {
    /** id 的描述 */
      id: string;
    /** title 的描述 */
      title: string;
    /** points 的描述 */
      points: number;
    /** description 的描述 */
      description: string;
    /** expiryDate 的描述 */
      expiryDate: string;
    /** claimed 的描述 */
      claimed: false | true;
  }

  interface IHealthRecord {
    /** id 的描述 */
      id: string;
    /** memberId 的描述 */
      memberId: string;
    /** recordType 的描述 */
      recordType: diagnosis  treatment  medication  checkup;
    date: string;
    details: {
      condition: string;
      treatment: string;
      medication: string;
      dosage: string;
      frequency: string;
      notes: string;
    };
  }
}

// 通用工具类型声明
declare namespace Utils {
  interface Logger {
    infomessage: string, args: any: void;
    errormessage: string, error: Error: void;
    warnmessage: string, args: any: void;
    debugmessage: string, args: any: void;
  }

  interface ErrorHandler {
    handleerror: Error: void;
    reporterror: Error: Promisevoid;
  }

  interface Analytics {
    trackEventeventName: string, properties: Recordstring, any: void;
    trackErrorerror: Error: void;
  }
}

// 服务相关类型声明
declare namespace Services {
  interface HealthService {
    getHealthRecordsmemberId: string: PromiseHealthHealthRecord;
    updateHealthRecordrecord: HealthHealthRecord: Promisevoid;
    deleteHealthRecordrecordId: string: Promisevoid;
  }

  interface RewardService {
    getRewardsuserId: string: PromiseHealthReward;
    claimRewardrewardId: string: Promisevoid;
    checkEligibilityuserId: string, rewardId: string: Promiseboolean;
  }
}
