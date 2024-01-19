import { Component } from '@angular/core';

@Component({
  selector: 'form[app-form]',
  styles: `:host { @apply flex w-full flex-col gap-3 }`,
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
})
export class FormComponent {}
