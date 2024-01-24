import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BrandComponent } from '../../components/brand/brand.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FormComponent } from '../../components/form/form.component';
import { InputComponent } from '../../components/input/input.component';
import { ToastService } from '../../components/toast/toast.service';
import { UsersService } from '../../resources/users/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputComponent,
    FormComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    BrandComponent,
    RouterModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private readonly userService: UsersService,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.singup(this.registerForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
          this.toastService.show({
            message: 'Cadastro realizado com sucesso!',
            type: 'success',
          });
        },
        error: (error) => {
          this.handleServerError(error);
        },
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  private handleServerError(error: any) {
    const errors = error?.error?.message;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        const control = this.registerForm.get(err.path);

        if (control) {
          control.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
