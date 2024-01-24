import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { ButtonComponent } from '../../../components/button/button.component';
import { DeleteButtonComponent } from '../../../components/delete-button/delete-button.component';
import { FormComponent } from '../../../components/form/form.component';
import { InputComponent } from '../../../components/input/input.component';
import { ChartPieComponent } from '../../../components/pie-chart/pie-chart.component';
import { SelectComponent } from '../../../components/select/select.component';
import { ToastService } from '../../../components/toast/toast.service';
import { UsersService } from '../../../resources/users/users.service';
import { UserAdmin } from '../../../types/UserAdmin';

@Component({
  selector: 'app-users-save',
  templateUrl: './users-save.component.html',
  standalone: true,
  imports: [
    InputComponent,
    FormComponent,
    ButtonComponent,
    SelectComponent,
    ReactiveFormsModule,
    FormsModule,
    ChartPieComponent,
    RouterModule,
    CommonModule,
    DeleteButtonComponent,
  ],
})
export class UsersSaveComponent {
  userForm: FormGroup;
  user: UserAdmin = {} as UserAdmin;
  typeOptions = [
    { value: 'USER', label: 'Usuário' },
    { value: 'ADMIN', label: 'Administrador' },
  ];

  constructor(
    private readonly usersService: UsersService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      role: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') as string;

      if (id) {
        this.usersService.getUser(id).subscribe((user) => {
          this.user = user;

          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            document: user.document,
            role: user.role,
          });

          this.userForm.get('password')?.clearValidators();
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.user.id) {
        this.usersService
          .updateUser(this.user.id, this.userForm.value)
          .subscribe({
            next: (response) => {
              this.toastService.show({
                message: 'Usuario atualizado com sucesso',
                type: 'success',
              });

              this.router.navigate(['usuarios/editar', response.id]);
            },
            error: (error) => {
              console.log(error);
              this.handleServerError(error);
            },
          });
      } else {
        this.usersService.createUser(this.userForm.value).subscribe({
          next: (response) => {
            this.toastService.show({
              message: 'Usuario criado com sucesso',
              type: 'success',
            });

            this.router.navigate(['usuarios/editar', response.id]);
          },
          error: (error) => {
            console.log(error);
            this.handleServerError(error);
          },
        });
      }
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  handleDeeleteAction() {
    this.usersService.deleteUser(this.user.id).subscribe({
      next: (response) => {
        this.toastService.show({
          message: 'Usuario excluído com sucesso',
          type: 'success',
        });

        this.router.navigate(['usuarios']);
      },
      error: (error) => {
        this.handleServerError(error);
      },
    });
  }

  private handleServerError(error: any) {
    const errors = error?.error?.message;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        const control = this.userForm.get(err.path);

        if (control) {
          control.setErrors({ serverError: err.message });
        }
      });
    } else {
      this.toastService.show({
        message: errors,
        type: 'error',
      });
    }
  }
}
