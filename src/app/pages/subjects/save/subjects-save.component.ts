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
import { SubjectVotesService } from '../../../resources/subject-votes/subject-votes.service';
import { SubjectsService } from '../../../resources/subjects/subjects.service';
import { Subject } from '../../../types/Subject';
import { SubjectCategory } from '../../../types/SubjectCategory';
import { VoteResults } from '../../../types/VoteResults';

@Component({
  selector: 'app-subjects-save',
  templateUrl: './subjects-save.component.html',
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
export class SubjectsSaveComponent {
  subjectForm: FormGroup;
  subject: Subject = {} as Subject;
  voteResults: VoteResults = {} as VoteResults;
  categories: SubjectCategory[] = [];
  categoryOptions: { value: string; label: string }[] = [];

  constructor(
    private readonly subjectCategories: SubjectCategoriesService,
    private readonly subjectsService: SubjectsService,
    private readonly subjectVotesService: SubjectVotesService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.subjectForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      timeToEnd: new FormControl('', [Validators.required]),
      startAt: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.subjectCategories.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.title,
      }));
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') as string;

      if (id) {
        this.subjectsService.getSubject(id).subscribe((subject) => {
          this.subject = subject;

          this.subjectForm.patchValue({
            title: subject.title,
            description: subject.description,
            timeToEnd: subject.timeToEnd,
            startAt: new Date(subject.startAt).toISOString().slice(0, 16),
            categoryId: subject.category.id,
          });

          this.subjectVotesService.getResults(this.subject.id).subscribe({
            next: (results) => {
              this.voteResults = results;
            },

            error: (error) => {
              this.handleServerError(error);
            },
          });
        });
      }
    });
  }

  onSubmit() {
    if (this.subjectForm.valid) {
      if (this.subject.id) {
        this.subjectsService
          .updateSubject(this.subject.id, this.subjectForm.value)
          .subscribe({
            next: (response) => {
              this.toastService.show({
                message: 'Pauta atualizada com sucesso',
                type: 'success',
              });

              this.router.navigate(['pautas/editar', response.id]);
            },
            error: (error) => {
              console.log(error);
              this.handleServerError(error);
            },
          });
      } else {
        this.subjectsService.createSubject(this.subjectForm.value).subscribe({
          next: (response) => {
            this.toastService.show({
              message: 'Pauta criada com sucesso',
              type: 'success',
            });

            this.router.navigate(['pautas/editar', response.id]);
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
    const control = this.subjectForm.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  handleDeeleteAction() {
    this.subjectsService.deleteSubject(this.subject.id).subscribe({
      next: (response) => {
        this.toastService.show({
          message: 'Pauta excluída com sucesso',
          type: 'success',
        });

        this.router.navigate(['pautas']);
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
        const control = this.subjectForm.get(err.path);

        if (control) {
          control.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
