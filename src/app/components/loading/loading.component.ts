import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  template: `
    <div
      *ngIf="isLoading$ | async"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4"
        role="status"
      >
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `,
  styles: [
    `
      .spinner-border {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        vertical-align: text-bottom;
        border: 0.25em solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spinner-border 0.75s linear infinite;
      }
      @keyframes spinner-border {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor() {
    this.isLoading$ = LoadingService.isLoading();

    console.log(this.isLoading$);
  }

  ngOnInit(): void {}
}
