import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
      return;
      this.authService.login(this.loginForm.value);
    }
  }
}
