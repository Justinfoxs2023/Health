/**
 * @fileoverview TS 文件 policy.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 安全策略类型
export interface ISecurityPolicy {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** type 的描述 */
  type: PolicyType;
  /** rules 的描述 */
  rules: ISecurityRule[];
  /** priority 的描述 */
  priority: number;
  /** status 的描述 */
  status: 'active' | 'disabled';
  /** createdAt 的描述 */
  createdAt: Date;
  /** updatedAt 的描述 */
  updatedAt: Date;
}

export type PolicyType =
  | 'access_control' // 访问控制
  | 'data_protection' // 数据保护
  | 'authentication' // 认证策略
  | 'network' // 网络安全
  | 'compliance'; // 合规策略

export interface ISecurityRule {
  /** id 的描述 */
  id: string;
  /** condition 的描述 */
  condition: IRuleCondition;
  /** action 的描述 */
  action: IRuleAction;
  /** target 的描述 */
  target: IRuleTarget;
  /** exceptions 的描述 */
  exceptions?: RuleException[];
}

export interface IRuleCondition {
  /** type 的描述 */
  type: string;
  /** operator 的描述 */
  operator: 'equals' | 'contains' | 'regex' | 'greater' | 'less';
  /** value 的描述 */
  value: any;
  /** logic 的描述 */
  logic?: 'and' | 'or';
  /** subConditions 的描述 */
  subConditions?: IRuleCondition[];
}

export interface IRuleAction {
  /** type 的描述 */
  type: 'allow' | 'deny' | 'require' | 'notify' | 'log';
  /** params 的描述 */
  params?: any;
}

export interface IRuleTarget {
  /** type 的描述 */
  type: 'user' | 'role' | 'resource' | 'operation';
  /** value 的描述 */
  value: string | string[];
}
