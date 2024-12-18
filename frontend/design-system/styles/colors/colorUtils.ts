/**
 * @fileoverview TS 文件 colorUtils.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class ColorUtils {
  // 颜色透明度调整
  static withOpacity(color: string, opacity: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // 渐变色生成
  static createGradient(startColor: string, endColor: string, direction = '45deg'): string {
    return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
  }

  // 色彩对比度检查
  static checkContrast(foreground: string, background: string): number {
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const toLinear = (value: number): number => {
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
      };

      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (brightest + 0.05) / (darkest + 0.05);
  }
}
