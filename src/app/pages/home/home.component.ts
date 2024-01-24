import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { FormComponent } from '../../components/form/form.component';
import { PagerComponent } from '../../components/pager/pager.component';
import { SelectComponent } from '../../components/select/select.component';
import { SubjectCardComponent } from '../../components/subject-card/subject-card.component';
import { SubjectCategoriesService } from '../../resources/subject-categories/subject-categories.service';
import { SubjectsService } from '../../resources/subjects/subjects.service';
import { PaginateResponse } from '../../types/PaginateResponse';
import { Subject } from '../../types/Subject';
import { SubjectCategory } from '../../types/SubjectCategory';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SubjectCardComponent,
    CommonModule,
    PagerComponent,
    FormComponent,
    SelectComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  subjectsResponse: PaginateResponse<Subject> = {} as PaginateResponse<Subject>;
  categoryForm: FormGroup;
  categories: SubjectCategory[] = [];
  categoryOptions: { value: string; label: string }[] = [];

  constructor(
    private readonly subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private subjectCategories: SubjectCategoriesService,
    private router: Router,
  ) {
    this.categoryForm = new FormGroup({
      categoryId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const page = params.get('page');
      const categoryId = params.get('search');

      if (!categoryId) {
        this.categoryForm.reset();
      } else {
        this.categoryForm.patchValue({ categoryId });
      }

      this.subjectCategories.getCategories().subscribe((categories) => {
        this.categories = categories;
        this.categoryOptions = categories.map((category) => ({
          value: category.id,
          label: category.title,
        }));
      });

      this.subjectsService
        .getSubjects({
          page: page ? Number(page) : 1,
          categoryId: categoryId || undefined,
        })
        .subscribe((subjectsResponse) => {
          this.subjectsResponse = subjectsResponse;
        });
    });
  }

  onSubmit() {
    if (!this.categoryForm.valid) {
      this.router.navigate(['votacao']);
      return;
    }

    this.router.navigate([
      'votacao/categoria',
      this.categoryForm.value.categoryId,
    ]);
  }

  handlePageChange(page: number) {
    if (this.categoryForm.valid) {
      this.router.navigate([
        'votacao/categoria',
        this.categoryForm.value.categoryId,
        page,
      ]);
    } else {
      this.router.navigate(['votacao', page]);
    }
  }
}
