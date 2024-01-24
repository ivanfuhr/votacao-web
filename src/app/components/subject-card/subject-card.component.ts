import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject } from '../../types/Subject';
import { CountdownComponent } from '../countdown/countdown.component';

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CountdownComponent],
  templateUrl: './subject-card.component.html',
})
export class SubjectCardComponent implements OnInit, OnDestroy {
  @Input() subject: Subject = {} as Subject;
  @Input() showActions: boolean = false;

  endTime: Date = new Date();
  isVoted: boolean = false;
  timeIsEnded: boolean = false;
  constructor() {}

  ngOnInit() {
    this.endTime = new Date(this.subject.endAt);

    if (this.subject.votes && this.subject.votes.length > 0) {
      this.isVoted = true;
    }

    if (this.endTime.getTime() < Date.now()) {
      this.timeIsEnded = true;
    }
  }

  ngOnDestroy() {}

  handleTimeIsEnded() {
    this.timeIsEnded = true;
  }
}
