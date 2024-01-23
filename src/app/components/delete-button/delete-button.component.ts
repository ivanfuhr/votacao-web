import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-2">
      <button
        class="w-full rounded border border-red-700 bg-red-600 p-4 font-medium text-zinc-200 ring-red-900 ring-offset-2 focus-within:ring-1"
        (click)="handleClick()"
        type="button"
      >
        Excluir
      </button>

      <span *ngIf="showWarning" class="text-sm font-thin text-red-500">
        * clique novamente no botão para excluir.
      </span>
    </div>
  `,
})
export class DeleteButtonComponent {
  @Output() deleteAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  showWarning: boolean = false;
  private clickedOnce: boolean = false;
  private timeout?: number;

  handleClick() {
    if (this.clickedOnce) {
      this.deleteAction.emit(true);
      this.resetState();
    } else {
      this.showWarning = true;
      this.clickedOnce = true;

      this.timeout = window.setTimeout(() => {
        this.resetState();
      }, 5000);
    }
  }

  private resetState() {
    this.showWarning = false;
    this.clickedOnce = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
