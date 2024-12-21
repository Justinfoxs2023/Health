/**
 * @fileoverview TS 文件 types.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface ITab {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
}

export interface IProps {
  /** tabs 的描述 */
  tabs: ITab[];
  /** activeTab 的描述 */
  activeTab: string;
  /** onChangeTab 的描述 */
  onChangeTab: (tabId: string) => void;
}
