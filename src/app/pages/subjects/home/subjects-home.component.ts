import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { PagerComponent } from '../../../components/pager/pager.component';
import { SubjectCardComponent } from '../../../components/subject-card/subject-card.component';
import { SubjectsService } from '../../../resources/subjects/subjects.service';
import { PaginateResponse } from '../../../types/PaginateResponse';
import { Subject } from '../../../types/Subject';

@Component({
  selector: 'app-subjects-home',
  templateUrl: './subjects-home.component.html',
  standalone: true,
  imports: [CommonModule, SubjectCardComponent, PagerComponent, RouterModule],
})
export class SubjectsHomeComponent implements OnInit {
  subjectsResponse: PaginateResponse<Subject> = {} as PaginateResponse<Subject>;

  constructor(
    private readonly subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const page = params.get('page');

      this.subjectsService
        .getAllSubjects({ page: page ? Number(page) : 1 })
        .subscribe((subjectsResponse) => {
          this.subjectsResponse = subjectsResponse;
        });
    });
  }

  handlePageChange(page: number) {
    this.router.navigate(['pautas', page]);
  }
}
