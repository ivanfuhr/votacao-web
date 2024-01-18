import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [],
  template: `<form class="flex w-full flex-col gap-3">
    <ng-content></ng-content>
  </form>`,
})
export class FormComponent {}
