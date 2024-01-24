import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastService } from '../components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastService: ToastService) {}

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  handleServerError(form: FormGroup, error: any) {
    const errors = error?.error?.message;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        const control = form.get(err.path);
        if (control) {
          control.setErrors({ serverError: err.message });
        }
      });
    } else if (errors && typeof errors === 'string') {
      this.toastService.show({
        message: errors,
        type: 'error',
      });
    } else {
      this.toastService.show({
        message: 'Erro desconhecido',
        type: 'error',
      });
    }
  }
}
