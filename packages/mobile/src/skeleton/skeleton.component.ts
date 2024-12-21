import { Component, Input, OnInit } from '@angular/core';
import { ISkeletonConfig } from './skeleton.types';

@Component({
  selector: 'app-skeleton',
  template: `
    <div
      class="skeleton-container"
      [class]="config.animation"
      [style.--animation-duration]="config.duration + 'ms'"
      [style.--animation-delay]="config.delay + 'ms'"
      [style.--background-color]="config.style.backgroundColor"
      [style.--highlight-color]="config.style.highlightColor"
      [style.--border-radius]="config.style.borderRadius + 'px'"
      [style.gap]="config.layout.gap + 'px'"
    >
      <ng-container *ngFor="let row of rows">
        <div
          class="skeleton-item"
          *ngFor="let col of columns"
          [style.width]="getWidth()"
          [style.height]="getHeight()"
          [style.aspectRatio]="config.layout.aspectRatio"
        ></div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .skeleton-container {
        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        gap: var(--gap);
      }

      .skeleton-item {
        background-color: var(--background-color);
        border-radius: var(--border-radius);
        overflow: hidden;
        position: relative;
      }

      .pulse {
        animation: pulse var(--animation-duration) var(--animation-delay) infinite ease-in-out;
      }

      .wave {
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, var(--highlight-color), transparent);
          animation: wave var(--animation-duration) var(--animation-delay) infinite linear;
          transform: translateX(-100%);
        }
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes wave {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class SkeletonComponent implements OnInit {
  @Input() config: ISkeletonConfig;

  rows: number[];
  columns: number[];

  ngOnInit() {
    this.rows = Array(this.config.layout.rows).fill(0);
    this.columns = Array(this.config.layout.columns).fill(0);
  }

  getWidth(): string {
    return typeof this.config.style.width === 'number'
      ? `${this.config.style.width}px`
      : this.config.style.width;
  }

  getHeight(): string {
    return typeof this.config.style.height === 'number'
      ? `${this.config.style.height}px`
      : this.config.style.height;
  }
}
