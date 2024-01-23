import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  template: `
    <label
      class="relative z-0 flex w-full rounded border border-zinc-300 bg-zinc-50 p-4 text-zinc-800 ring-zinc-900 ring-offset-2 focus-within:ring-1"
    >
      <span
        [ngClass]="
          value
            ? 'absolute left-3 top-0 -translate-y-1/2 bg-zinc-50 px-1 text-zinc-800'
            : 'sr-only'
        "
        class="text-sm"
      >
        {{ placeholder }}</span
      >
      <input
        *ngIf="type !== 'textarea'"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        (input)="handleInput($event)"
        (blur)="onTouched()"
        class="w-full bg-zinc-50 outline-none"
      />

      <ng-container *ngIf="type === 'textarea'">
        <textarea
          [placeholder]="placeholder"
          [value]="value"
          (input)="handleInput($event)"
          (blur)="onTouched()"
          class="w-full bg-zinc-50 outline-none"
        ></textarea>
      </ng-container>
    </label>

    <div *ngIf="errorMessage" class="error-message mt-1 text-sm text-red-400">
      {{ errorMessage }}
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() type:
    | 'text'
    | 'password'
    | 'email'
    | 'textarea'
    | 'date'
    | 'datetime-local'
    | 'number' = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() mask: string = '';

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
    const inputValue = (event.target as HTMLInputElement).value;

    if (!this.mask) {
      this.value = inputValue;
      this.onChange(this.value);
      return;
    }

    this.value = this.applyMask(inputValue, this.mask);
    this.onChange(this.value);
  }

  applyMask(value: string, mask: string): string {
    let result = '';
    let valueIndex = 0;
    let maskIndex = 0;

    while (maskIndex < mask.length) {
      if (mask[maskIndex] === '0') {
        // Para dígitos
        if (valueIndex < value.length && !isNaN(Number(value[valueIndex]))) {
          result += value[valueIndex];
        } else {
          break; // Interrompe se não há mais dígitos ou se o caractere da entrada não é um dígito
        }
        valueIndex++;
      } else if (mask[maskIndex] === 'a') {
        // Para letras
        if (valueIndex < value.length && isNaN(Number(value[valueIndex]))) {
          result += value[valueIndex];
        } else {
          break; // Interrompe se não há mais letras ou se o caractere da entrada não é uma letra
        }
        valueIndex++;
      } else {
        result += mask[maskIndex];
        if (
          valueIndex < value.length &&
          mask[maskIndex] === value[valueIndex]
        ) {
          valueIndex++;
        }
      }
      maskIndex++;
    }

    return result;
  }
}
