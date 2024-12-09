// 安全策略类型
export interface SecurityPolicy {
  id: string;
  name: string;
  type: PolicyType;
  rules: SecurityRule[];
  priority: number;
  status: 'active' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

export type PolicyType = 
  | 'access_control'    // 访问控制
  | 'data_protection'   // 数据保护
  | 'authentication'    // 认证策略
  | 'network'          // 网络安全
  | 'compliance';      // 合规策略

export interface SecurityRule {
  id: string;
  condition: RuleCondition;
  action: RuleAction;
  target: RuleTarget;
  exceptions?: RuleException[];
}

export interface RuleCondition {
  type: string;
  operator: 'equals' | 'contains' | 'regex' | 'greater' | 'less';
  value: any;
  logic?: 'and' | 'or';
  subConditions?: RuleCondition[];
}

export interface RuleAction {
  type: 'allow' | 'deny' | 'require' | 'notify' | 'log';
  params?: any;
}

export interface RuleTarget {
  type: 'user' | 'role' | 'resource' | 'operation';
  value: string | string[];
} 