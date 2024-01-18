import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  template: `<div
    class="flex w-full rounded border border-zinc-300 bg-zinc-200 p-4 text-zinc-800 ring-zinc-900 ring-offset-2 focus-within:ring-1"
  >
    <input
      [type]="type"
      [placeholder]="placeholder"
      class="w-full bg-zinc-200 outline-none"
    />
  </div>`,
})
export class InputComponent {
  @Input() type: 'text' | 'password' | 'email' = 'text';
  @Input() placeholder: string = '';
}
