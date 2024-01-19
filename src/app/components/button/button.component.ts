import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `<button
    [type]="type"
    class="w-full rounded border border-zinc-900 bg-zinc-800 p-4 font-medium text-zinc-200 ring-zinc-900 ring-offset-2 focus-within:ring-1"
  >
    {{ label }}
  </button>`,
})
export class ButtonComponent {
  @Input() type: 'submit' | 'button' = 'button';
  @Input() label: string = '';
}
