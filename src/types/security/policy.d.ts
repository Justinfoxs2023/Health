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
    type: "access_control" | "data_protection" | "authentication" | "network" | "compliance";
  /** rules 的描述 */
    rules: ISecurityRule;
  /** priority 的描述 */
    priority: number;
  /** status 的描述 */
    status: active  /** disabled 的描述 */
    /** disabled 的描述 */
    disabled;
  /** createdAt 的描述 */
    createdAt: Date;
  /** updatedAt 的描述 */
    updatedAt: Date;
}

export type PolicyType =
  any; // 合规策略

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
    exceptions: RuleException;
}

export interface IRuleCondition {
  /** type 的描述 */
    type: string;
  /** operator 的描述 */
    operator: equals  contains  regex  greater  less;
  value: any;
  logic: and  or;
  subConditions: RuleCondition;
}

export interface IRuleAction {
  /** type 的描述 */
    type: allow  deny  require  notify  log;
  params: any;
}

export interface IRuleTarget {
  /** type 的描述 */
    type: user  role  resource  operation;
  value: string  string;
}
