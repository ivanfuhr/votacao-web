import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Subject } from '../../types/Subject';
import { SubjectVoted } from '../../types/SubjectVoted';
import { SubjectModalComponent } from '../subject-modal/subject-modal.component';

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [CommonModule, SubjectModalComponent],
  templateUrl: './subject-card.component.html',
})
export class SubjectCardComponent {
  @Input() subject: Subject = {} as Subject;

  private timer: any;
  private endTime: Date = new Date();
  isModalOpen: boolean = false;
  timeIsEnding: boolean = false;
  timeDisplay: string = '';
  isVoted: boolean = false;

  constructor() {}

  ngOnInit() {
    this.calculateEndTime();
    this.updateTimeDisplay();
    this.timer = setInterval(() => this.updateTimeDisplay(), 1000);

    if (this.subject.votes.length > 0) {
      this.isVoted = true;
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  voteEvent({ id, type }: SubjectVoted) {
    this.subject.votes.push({ id, type });
    this.isVoted = true;
  }

  private calculateEndTime() {
    this.endTime = new Date(
      new Date(this.subject.startAt).getTime() + this.subject.timeToEnd * 1000,
    );
  }

  private updateTimeDisplay() {
    const now = new Date();
    const timeLeft = this.endTime.getTime() - now.getTime();

    if (timeLeft > 0) {
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
