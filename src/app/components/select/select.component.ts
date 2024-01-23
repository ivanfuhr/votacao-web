import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  imports: [CommonModule],
  template: `
    <label
      class="relative flex w-full flex-col rounded border border-zinc-300 bg-zinc-50 p-4 text-zinc-800 ring-zinc-900 ring-offset-2 focus-within:ring-1"
    >
      <span
        [ngClass]="
          value
            ? 'absolute left-3 top-0 -translate-y-1/2 bg-zinc-50 px-1 text-zinc-800'
            : 'sr-only'
        "
        class="text-sm"
      >
        {{ placeholder }}
      </span>
      <select
        [value]="value"
        (change)="handleInput($event)"
        (blur)="onTouched()"
        class="mt-2 w-full bg-zinc-50 outline-none"
      >
        <option [value]="">{{ placeholder }}</option>
        <ng-container *ngFor="let option of options">
          <option [value]="option.value">{{ option.label }}</option>
        </ng-container>
      </select>
    </label>

    <div *ngIf="errorMessage" class="error-message mt-1 text-sm text-red-400">
      {{ errorMessage }}
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() options: { value: string; label: string }[] = [];

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
    const selectValue = (event.target as HTMLSelectElement).value;
    this.value = selectValue;
    this.onChange(this.value);
  }
}
