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
import { SubjectCategoriesService } from '../../../resources/subject-categories/subject-categories.service';
import { SubjectCategory } from '../../../types/SubjectCategory';

@Component({
  selector: 'app-subject-categories-save',
  templateUrl: './subject-categories-save.component.html',
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
export class SubjectCategoriesSaveComponent {
  subjectCategoryForm: FormGroup;
  category: SubjectCategory = {} as SubjectCategory;

  constructor(
    private readonly subjectCategories: SubjectCategoriesService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.subjectCategoryForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') as string;

      if (id) {
        this.subjectCategories.getCategory(id).subscribe((category) => {
          this.category = category;

          this.subjectCategoryForm.patchValue({
            title: category.title,
          });
        });
      }
    });
  }

  onSubmit() {
    if (this.subjectCategoryForm.valid) {
      if (this.category.id) {
        this.subjectCategories
          .updateCategory(this.category.id, this.subjectCategoryForm.value)
          .subscribe({
            next: (response) => {
              this.toastService.show({
                message: 'Categoria atualizada com sucesso',
                type: 'success',
              });

              this.router.navigate(['categorias/editar', response.id]);
            },
            error: (error) => {
              console.log(error);
              this.handleServerError(error);
            },
          });
      } else {
        this.subjectCategories
          .createCategory(this.subjectCategoryForm.value)
          .subscribe({
            next: (response) => {
              this.toastService.show({
                message: 'Categoria criada com sucesso',
                type: 'success',
              });

              this.router.navigate(['categorias/editar', response.id]);
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
    const control = this.subjectCategoryForm.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  handleDeeleteAction() {
    this.subjectCategories.deleteCategory(this.category.id).subscribe({
      next: (response) => {
        this.toastService.show({
          message: 'Categoria excluída com sucesso',
          type: 'success',
        });

        this.router.navigate(['categorias']);
      },
      error: (error) => {
        console.log(error);
        this.handleServerError(error);
      },
    });
  }

  private handleServerError(error: any) {
    const errors = error?.error?.message;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        const control = this.subjectCategoryForm.get(err.path);

        if (control) {
          control.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
