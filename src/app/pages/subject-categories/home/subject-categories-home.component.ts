import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PagerComponent } from '../../../components/pager/pager.component';
import { SubjectCardComponent } from '../../../components/subject-card/subject-card.component';
import { SubjectCategoriesService } from '../../../resources/subject-categories/subject-categories.service';
import { SubjectCategory } from '../../../types/SubjectCategory';

@Component({
  selector: 'app-subject-categories-home',
  templateUrl: './subject-categories-home.component.html',
  standalone: true,
  imports: [CommonModule, SubjectCardComponent, PagerComponent, RouterModule],
})
export class SubjectCategoriesHomeComponent implements OnInit {
  subjectCategories!: SubjectCategory[];

  constructor(
    private readonly subjectCategoriesService: SubjectCategoriesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subjectCategoriesService
      .getCategories()
      .subscribe((subjectCategories) => {
        this.subjectCategories = subjectCategories;
      });
  }
}
