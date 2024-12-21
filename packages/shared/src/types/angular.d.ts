/**
 * @fileoverview TS 文件 angular.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module '@angular/core' {
  export const Component: (options: { selector: string; template: string }) => ClassDecorator;

  export interface OnInit {
    ngOnInit(): void;
  }
}
