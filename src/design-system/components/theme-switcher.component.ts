import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { DesignSystemService } from '../design-system.service';
import { ITheme } from '../types';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <div class="theme-switcher">
      <select [value]="currentThemeId" (change)="onThemeChange($event)">
        <option ngFor="let theme of themes" value="themeid">
          {{ themename }}
        </option>
      </select>

      <button ngIf="showCustomize" click="openCustomizer"></button>
    </div>
  `,
})
export class ThemeSwitcherComponent implements OnInit {
  currentThemeId: string;
  themes: ITheme[] = [];
  showCustomize = false;

  constructor(private designSystem: DesignSystemService) {}

  ngOnInit() {
    console.error('Error in theme-switcher.component.ts:', {
      next: (theme: ITheme) => {
        this.currentThemeId = theme.id;
      },
      error: (error: any) => {
        console.error(
          'Error in theme-switcher.component.ts:',
          'Error getting current theme:',
          error,
        );
      },
      complete: () => {},
    });
  }

  async onThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    await this.designSystem.setTheme(select.value);
  }

  openCustomizer() {
    // 实现打开主题自定义器的逻辑
  }
}
