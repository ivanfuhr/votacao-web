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
import { ChartPieComponent } from '../../components/pie-chart/pie-chart.component';
import { ToastService } from '../../components/toast/toast.service';
import { SubjectVotesService } from '../../resources/subject-votes/subject-votes.service';
import { SubjectsService } from '../../resources/subjects/subjects.service';
import { Subject } from '../../types/Subject';
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
  timeDisplay: string = '';
  timeIsEnding: boolean = false;
  voteResults: VoteResults = {} as VoteResults;
  endTime: Date = new Date();
  timer: any;
  isVoted: boolean = false;
  voteForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
    private subjectVotesService: SubjectVotesService,
    private toastService: ToastService,
    private router: RouterModule,
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

            if (subject.votes.length > 0) {
              this.isVoted = true;
            }

            this.calculateEndTime();
            this.updateTimeDisplay();

            setInterval(() => this.updateTimeDisplay(), 1000);

            if (this.isVoted || this.timeIsEnding) {
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
              if (this.timer) {
                clearInterval(this.timer);
              }

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

  private calculateEndTime() {
    this.endTime = new Date(
      new Date(this.subject.startAt).getTime() + this.subject.timeToEnd * 1000,
    );
  }

  private updateTimeDisplay() {
    const now = new Date();
    const timeLeft = this.endTime.getTime() - now.getTime();

    if (timeLeft > 0 && !this.isVoted) {
      this.timeDisplay = this.millisecondsToDhms(timeLeft);
    } else {
      this.timeDisplay = 'Tempo esgotado';
      this.timeIsEnding = true;
      clearInterval(this.timer);
    }
  }

  private millisecondsToDhms(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + 'd ' : '';
    const hDisplay = h > 0 ? h + 'h ' : '';
    const mDisplay = m > 0 ? m + 'm ' : '';
    const sDisplay = s > 0 ? s + 's' : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
}
