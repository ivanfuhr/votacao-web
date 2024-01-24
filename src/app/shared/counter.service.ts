// counter.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private timerRequest: number | null = null;
  private endTime!: Date;
  private updateCallback!: (timeDisplay: string, timeIsEnding: boolean) => void;

  constructor() {}

  startCounter(
    endTime: Date,
    updateCallback: (timeDisplay: string, timeIsEnding: boolean) => void,
  ) {
    this.endTime = endTime;
    this.updateCallback = updateCallback;
    this.runTimer();
  }

  private runTimer() {
    const update = () => {
      const now = new Date();
      const timeLeft = this.endTime.getTime() - now.getTime();
      let timeIsEnding = false;
      let timeDisplay = '';

      if (timeLeft > 0) {
        timeDisplay = this.millisecondsToDhms(timeLeft);
        this.timerRequest = requestAnimationFrame(update);
      } else {
        timeDisplay = 'Tempo esgotado';
        timeIsEnding = true;
        if (this.timerRequest) {
          cancelAnimationFrame(this.timerRequest);
          this.timerRequest = null;
        }
      }

      this.updateCallback(timeDisplay, timeIsEnding);
    };

    this.timerRequest = requestAnimationFrame(update);
  }

  stopCounter() {
    if (this.timerRequest) {
      cancelAnimationFrame(this.timerRequest);
      this.timerRequest = null;
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
