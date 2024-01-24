import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  template: '<span>{{ countdown }}</span>',
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() endAt!: Date;
  @Output() timeIsEnded: EventEmitter<void> = new EventEmitter<void>();

  private intervalId!: number;
  countdown: string = '';

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startCountdown(): void {
    this.updateCountdown();
    if (typeof window !== 'undefined') {
      this.intervalId = window.setInterval(() => {
        this.updateCountdown();
        if (new Date() >= this.endAt) {
          clearInterval(this.intervalId);
          this.countdown = 'Tempo esgotado';

          this.timeIsEnded.emit();
        }
      }, 1000);
    }
  }

  private updateCountdown(): void {
    const now = new Date();
    const milliseconds = this.endAt.getTime() - now.getTime();
    this.countdown = this.millisecondsToDhms(milliseconds);
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
