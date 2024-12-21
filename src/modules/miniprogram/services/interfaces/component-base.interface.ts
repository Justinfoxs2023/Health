/**
 * @fileoverview TS 文件 component-base.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IComponentBaseService {
  /** registerComponentname 的描述 */
    registerComponentname: string, /** component 的描述 */
    /** component 的描述 */
    component: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** getComponentname 的描述 */
    getComponentname: string: /** any 的描述 */
    /** any 的描述 */
    any;
  /** updateComponentConfigname 的描述 */
    updateComponentConfigname: string, /** config 的描述 */
    /** config 的描述 */
    config: any: /** void 的描述 */
    /** void 的描述 */
    void;
  /** getAllComponents 的描述 */
    getAllComponents: Mapstring, /** any 的描述 */
    /** any 的描述 */
    any;
  /** unregisterComponentname 的描述 */
    unregisterComponentname: string: /** void 的描述 */
    /** void 的描述 */
    void;
  /** hasComponentname 的描述 */
    hasComponentname: string: /** boolean 的描述 */
    /** boolean 的描述 */
    boolean;
}
