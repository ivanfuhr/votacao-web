import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrandComponent } from '../../components/brand/brand.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FormComponent } from '../../components/form/form.component';
import { InputComponent } from '../../components/input/input.component';
import { AuthService } from '../../resources/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputComponent,
    FormComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    BrandComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private readonly authService: AuthService) {
    this.loginForm = new FormGroup({
      document: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
        },
        error: (error) => {
          this.handleServerError(error);
        },
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  private handleServerError(error: any) {
    const errors = error?.error?.message;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        const control = this.loginForm.get(err.path);

        if (control) {
          control.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
