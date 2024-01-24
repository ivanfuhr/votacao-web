import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ButtonComponent } from '../../components/button/button.component';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { ChartPieComponent } from '../../components/pie-chart/pie-chart.component';
import { ToastService } from '../../components/toast/toast.service';
import { AuthService } from '../../resources/auth/auth.service';
import { SubjectVotesService } from '../../resources/subject-votes/subject-votes.service';
import { SubjectsService } from '../../resources/subjects/subjects.service';
import { Subject } from '../../types/Subject';
import { User } from '../../types/User';
import { VoteResults } from '../../types/VoteResults';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    ChartPieComponent,
    CountdownComponent,
    RouterModule,
  ],
  styles: `
  
    #sim:checked + label {
      @apply bg-green-700;
    }

    #nao:checked + label {
      @apply bg-red-700;
    }
  `,
  templateUrl: './vote.component.html',
})
export class VoteComponent implements OnInit {
  subject: Subject = {} as Subject;
  voteResults: VoteResults = {} as VoteResults;
  isVoted: boolean = false;
  endTime = new Date();
  timeIsEnded: boolean = false;
  voteForm: FormGroup;
  user: User | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
    private subjectVotesService: SubjectVotesService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    this.voteForm = new FormGroup({
      vote: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id') as string;

      this.subjectsService
        .getSubject(id)
        .pipe(
          map((subject) => {
            this.subject = subject;

            this.endTime = new Date(subject.endAt);

            if (subject.votes.length > 0) {
              this.isVoted = true;
            }

            if (this.endTime.getTime() < Date.now()) {
              this.timeIsEnded = true;
            }

            this.authService.getUser().subscribe((user) => {
              this.user = user;
            });

            if (this.isVoted || this.timeIsEnded) {
              this.subjectVotesService.getResults(this.subject.id).subscribe({
                next: (results) => {
                  this.voteResults = results;
                },
                error: (error) => {
                  this.handleServerError(error);
                },
              });
            }
          }),

          catchError((err) => {
            this.toastService.show({
              message: err?.error?.message || 'Erro desconhecido',
              type: 'error',
            });

            return of(null);
          }),
        )
        .subscribe();
    });
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

              this.isVoted = true;
              this.subject.votes.push(response);
            }

            this.subjectVotesService.getResults(this.subject.id).subscribe({
              next: (results) => {
                this.voteResults = results;
              },

              error: (error) => {
                this.handleServerError(error);
              },
            });
          },
          error: (error) => {
            this.handleServerError(error);
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

  handleTimeIsEnded() {
    this.timeIsEnded = true;
  }
}
