import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubjectVotesService } from '../../resources/subject-votes/subject-votes.service';
import { Subject } from '../../types/Subject';
import { ButtonComponent } from '../button/button.component';
import { FormComponent } from '../form/form.component';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-subject-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormComponent,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  styles: `
  
    #sim:checked + label {
      @apply bg-green-700;
    }

    #nao:checked + label {
      @apply bg-red-700;
    }

  `,
  templateUrl: './subject-modal.component.html',
})
export class SubjectModalComponent {
  voteForm: FormGroup;
  isOpen: boolean = false;

  @Input() subject: Subject = {} as Subject;
  @Input() timeDisplay: string = '';
  @Input() timeIsEnding: boolean = false;
  @Output() voteEvent = new EventEmitter();

  constructor(
    private readonly subjectVotesService: SubjectVotesService,
    private readonly toastService: ToastService,
  ) {
    this.voteForm = new FormGroup({
      vote: new FormControl('', [Validators.required]),
    });
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  onSubmit() {
    if (this.voteForm.valid) {
      this.subjectVotesService
        .createVote(this.subject.id, this.voteForm.value.vote)
        .subscribe({
          next: (response) => {
            if (response) {
              this.toastService.show({
                message: 'Voto computado com sucesso!',
                type: 'success',
              });

              this.voteEvent.emit({
                id: response.id,
                type: response.type,
              });
            }
          },
          error: (error) => {
            this.handleServerError(error);
          },
          complete: () => {
            this.closeModal();
          },
        });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.voteForm.get(controlName);
    if (control && control.errors && 'serverError' in control.errors) {
      return control.errors['serverError'];
    }
    return '';
  }

  private handleServerError(error: any) {
    const errors = error?.error?.message;

    if (errors && Array.isArray(errors)) {
      errors.forEach((err) => {
        const control = this.voteForm.get(err.path);

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
