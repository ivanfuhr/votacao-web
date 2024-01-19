import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div
      *ngIf="toastMessage.show"
      class="toast fixed right-5 top-5 z-50 w-full max-w-xs rounded p-4 shadow-lg"
      [ngClass]="{
        'bg-green-500': toastMessage.type === 'success',
        'bg-red-500': toastMessage.type === 'error',
        'slide-in': toastMessage.show,
        'slide-out': !toastMessage.show
      }"
    >
      <span class="text-sm font-medium text-zinc-100">{{
        toastMessage.message
      }}</span>
    </div>
  `,
  styleUrls: ['./toast.component.css'],
  standalone: true,
})
export class ToastComponent implements OnDestroy {
  toastMessage: ToastMessage;
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.toastMessage = { message: '', type: 'success', show: false };

    this.subscription = this.toastService.toastState.subscribe(
      (state: ToastMessage) => {
        this.toastMessage = state;
      },
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
