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
import { UsersService } from '../../../resources/users/users.service';
import { PaginateResponse } from '../../../types/PaginateResponse';
import { UserAdmin } from '../../../types/UserAdmin';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  standalone: true,
  imports: [CommonModule, SubjectCardComponent, PagerComponent, RouterModule],
})
export class UsersHomeComponent implements OnInit {
  users!: PaginateResponse<UserAdmin>;

  constructor(
    private readonly usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const page = params.get('page');

      this.usersService
        .getUsers({ page: page ? Number(page) : 1 })
        .subscribe((usersResponse) => {
          this.users = usersResponse;
        });
    });
  }

  handlePageChange(page: number) {
    this.router.navigate(['usuarios', page]);
  }
}
