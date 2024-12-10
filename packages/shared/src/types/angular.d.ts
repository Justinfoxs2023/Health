declare module '@angular/core' {
  export const Component: (options: {
    selector: string;
    template: string;
  }) => ClassDecorator;

  export interface OnInit {
    ngOnInit(): void;
  }
} 