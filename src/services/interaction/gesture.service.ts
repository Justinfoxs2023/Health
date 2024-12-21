/**
 * @fileoverview TS 文件 gesture.service.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export class GestureService {
  // 手势识别与处理
  private gestureRecognizer: GestureRecognizer;

  // 注册手势
  registerGestures(gestures: GestureConfig[]): void {
    gestures.forEach(gesture => {
      this.gestureRecognizer.add(gesture.name, gesture.recognizer);
    });
  }

  // 手势响应
  handleGesture(event: GestureEvent): void {
    const response = this.gestureRecognizer.recognize(event);
    if (response) {
      this.executeGestureAction(response);
    }
  }
}
