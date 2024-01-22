import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SubjectCardComponent } from '../../components/subject-card/subject-card.component';
import { SubjectsService } from '../../resources/subjects/subjects.service';
import { Subject } from '../../types/Subject';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SubjectCardComponent, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  subjects: Subject[] = [];

  constructor(private readonly subjectsService: SubjectsService) {
    this.subjectsService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });
  }

  ngOnInit(): void {}
}
