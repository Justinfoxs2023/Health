/**
 * @fileoverview TS 文件 service.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

// 服务定义接口
export interface IServiceDefinition {
  /** name 的描述 */
  name: string;
  /** version 的描述 */
  version: string;
  /** endpoints 的描述 */
  endpoints: IServiceEndpoint;
}

// 服务端点接口
export interface IServiceEndpoint {
  /** protocol 的描述 */
  protocol: string;
  /** host 的描述 */
  host: string;
  /** port 的描述 */
  port: number;
}

// 服务实例接口
export interface IServiceInstance {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** address 的描述 */
  address: string;
  /** port 的描述 */
  port: number;
  /** tags 的描述 */
  tags: string;
}

// 健康状态接口
export interface IHealthStatus {
  /** status 的描述 */
  status: string;
  /** output 的描述 */
  output: string;
  /** timestamp 的描述 */
  timestamp: Date;
}
