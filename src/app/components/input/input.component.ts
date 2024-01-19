import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <label
      class="flex w-full rounded border border-zinc-300 bg-zinc-200 p-4 text-zinc-800 ring-zinc-900 ring-offset-2 focus-within:ring-1"
    >
      <span class="sr-only">{{ placeholder }}</span>

      <input
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        (input)="handleInput($event)"
        (blur)="onTouched()"
        class="w-full bg-zinc-200 outline-none"
      />
    </label>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'password' | 'email' = 'text';
  @Input() placeholder: string = '';

  value: string = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value !== undefined && value !== null) {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }
}
