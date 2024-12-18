/**
 * @fileoverview TS 文件 themes.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

interface IThemeConfig {
  /** colors 的描述 */
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  /** spacing 的描述 */
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  /** typography 的描述 */
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
}
