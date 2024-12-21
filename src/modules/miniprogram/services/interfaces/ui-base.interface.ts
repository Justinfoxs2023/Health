/**
 * @fileoverview TS 文件 ui-base.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IUIBaseService {
   
  /** applyThemetheme 的描述 */
    applyThemetheme: any: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** updateStylesstyles 的描述 */
    updateStylesstyles: any: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** getThemeConfig 的描述 */
    getThemeConfig: any;

   
  /** registerCustomStylesstyles 的描述 */
    registerCustomStylesstyles: any: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** applyAnimationelement 的描述 */
    applyAnimationelement: any, /** animation 的描述 */
    /** animation 的描述 */
    animation: any: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** getSystemInfo 的描述 */
    getSystemInfo: Promiseany;
}
