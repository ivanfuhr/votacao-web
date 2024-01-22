import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SubjectCardComponent } from '../../components/subject-card/subject-card.component';
import { SubjectsService } from '../../resources/subjects/subjects.service';
import { Subject } from '../../types/Subject';

@Component({
  selector: 'app-my-vote',
  standalone: true,
  imports: [SubjectCardComponent, CommonModule],
  templateUrl: './my-votes.component.html',
})
export class MyVotesComponent implements OnInit {
  subjects: Subject[] = [];

  constructor(private readonly subjectsService: SubjectsService) {
    this.subjectsService.getSubjectsVotedByUser().subscribe((subjects) => {
      this.subjects = subjects;
    });
  }

  ngOnInit(): void {}
}
