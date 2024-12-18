/**
 * @fileoverview TS 文件 cloud-base.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ICloudBaseService {
  /** initializeCloud 的描述 */
    initializeCloud: Promisevoid;
  /** invokeFunctionname 的描述 */
    invokeFunctionname: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** uploadFilefilePath 的描述 */
    uploadFilefilePath: string, /** cloudPath 的描述 */
    /** cloudPath 的描述 */
    cloudPath: string: /** Promisestring 的描述 */
    /** Promisestring 的描述 */
    Promisestring;
  /** getDatabaseDatacollection 的描述 */
    getDatabaseDatacollection: string, /** query 的描述 */
    /** query 的描述 */
    query: any: /** Promiseany 的描述 */
    /** Promiseany 的描述 */
    Promiseany;
  /** setDatabaseDatacollection 的描述 */
    setDatabaseDatacollection: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;
}
