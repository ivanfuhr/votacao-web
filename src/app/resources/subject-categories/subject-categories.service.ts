import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubjectCategory } from '../../types/SubjectCategory';

@Injectable({
  providedIn: 'root',
})
export class SubjectCategoriesService {
  private apiUrl = 'http://localhost:3000/subject-categories';

  constructor(private httpClient: HttpClient) {}

  getCategories() {
    return this.httpClient.get<SubjectCategory[]>(this.apiUrl);
  }
}
