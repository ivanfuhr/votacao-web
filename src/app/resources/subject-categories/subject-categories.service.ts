import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { SubjectCategory } from '../../types/SubjectCategory';

@Injectable({
  providedIn: 'root',
})
export class SubjectCategoriesService {
  private apiUrl = `${environment.apiUrl}/subject-categories`;

  constructor(private httpClient: HttpClient) {}

  getCategories() {
    return this.httpClient.get<SubjectCategory[]>(this.apiUrl);
  }

  getCategory(id: string) {
    return this.httpClient.get<SubjectCategory>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: SubjectCategory) {
    return this.httpClient.post<SubjectCategory>(this.apiUrl, category);
  }

  updateCategory(id: string, category: SubjectCategory) {
    return this.httpClient.put<SubjectCategory>(
      `${this.apiUrl}/${category.id}`,
      category,
    );
  }

  deleteCategory(id: string) {
    return this.httpClient.delete<SubjectCategory>(`${this.apiUrl}/${id}`);
  }
}
