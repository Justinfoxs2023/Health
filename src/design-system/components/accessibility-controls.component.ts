import { Component, OnInit } from '@angular/core';
import { DesignSystemService } from '../design-system.service';
import { IAccessibilityConfig } from '../types';

@Component({
  selector: 'app-accessibility-controls',
  template: `
    <div class="accessibility-controls">
      <section class="visual-controls">
        <h3></h3>
        <div class="control-group">
          <label>
            <input
              type="checkbox"
              [checked]="config.visual.highContrast"
              (change)="toggleHighContrast($event)"
            />
            高对比度
          </label>

          <label>
            <input
              type="checkbox"
              [checked]="config.visual.reducedMotion"
              (change)="toggleReducedMotion($event)"
            />
            减少动画
          </label>

          <div class="font-size-control">
            <label></label>
            <input
              type="range"
              [value]="config.visual.fontSize"
              (input)="adjustFontSize($event)"
              min="12"
              max="24"
              step="1"
            />
          </div>
        </div>
      </section>

      <section class="keyboard-controls">
        <h3></h3>
        <div class="control-group">
          <label>
            <input
              type="checkbox"
              [checked]="config.keyboard.enabled"
              (change)="toggleKeyboardNav($event)"
            />
            启用键盘导航
          </label>
        </div>
      </section>

      <section class="voice-controls">
        <h3></h3>
        <div class="control-group">
          <label>
            <input
              type="checkbox"
              [checked]="config.voice.enabled"
              (change)="toggleVoiceControl($event)"
            />
            启用语音控制
          </label>
        </div>
      </section>
    </div>
  `,
})
export class AccessibilityControlsComponent implements OnInit {
  config: IAccessibilityConfig;

  constructor(private designSystem: DesignSystemService) {}

  ngOnInit() {
    this.designSystem.getAccessibilityConfig().subscribe(config => {
      this.config = config;
    });
  }

  async toggleHighContrast(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    await this.designSystem.setAccessibilityConfig({
      visual: {
        ...this.config.visual,
        highContrast: checkbox.checked,
      },
    });
  }

  async toggleReducedMotion(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    await this.designSystem.setAccessibilityConfig({
      visual: {
        ...this.config.visual,
        reducedMotion: checkbox.checked,
      },
    });
  }

  async adjustFontSize(event: Event) {
    const input = event.target as HTMLInputElement;
    await this.designSystem.setAccessibilityConfig({
      visual: {
        ...this.config.visual,
        fontSize: parseInt(input.value),
      },
    });
  }

  async toggleKeyboardNav(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    await this.designSystem.setAccessibilityConfig({
      keyboard: {
        ...this.config.keyboard,
        enabled: checkbox.checked,
      },
    });
  }

  async toggleVoiceControl(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    await this.designSystem.setAccessibilityConfig({
      voice: {
        ...this.config.voice,
        enabled: checkbox.checked,
      },
    });
  }
}
