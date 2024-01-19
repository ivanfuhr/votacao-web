import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage>({
    message: '',
    type: 'success',
    show: false,
  });

  public toastState = this.toastSubject.asObservable();

  constructor() {}

  show({
    message,
    type = 'success',
  }: {
    message: string;
    type: 'success' | 'error';
  }) {
    this.toastSubject.next({ message, type, show: true });

    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  private hideToast() {
    this.toastSubject.next({ message: '', type: 'success', show: false });
  }
}
