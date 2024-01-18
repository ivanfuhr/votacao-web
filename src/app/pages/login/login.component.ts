import { Component } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { InputComponent } from '../../components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, FormComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {}
