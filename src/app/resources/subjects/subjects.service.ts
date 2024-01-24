import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { PaginateResponse } from '../../types/PaginateResponse';
import { Subject, SubjectCreate } from '../../types/Subject';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private apiUrl = `${environment.apiUrl}/subjects`;

  constructor(private httpClient: HttpClient) {}

  getSubject(id: string) {
    return this.httpClient.get<Subject>(`${this.apiUrl}/${id}`);
  }

  getSubjects({ page, categoryId }: { page: number; categoryId?: string }) {
    const url = new URL(this.apiUrl);
    if (page) {
      url.searchParams.set('page', page.toString());
    }

    if (categoryId) {
      url.searchParams.set('categoryId', categoryId);
    }

    return this.httpClient.get<PaginateResponse<Subject>>(url.toString());
  }

  getSubjectsVotedByUser({ page }: { page: number }) {
    const url = new URL(`${this.apiUrl}/my-votes`);
    if (page) {
      url.searchParams.set('page', page.toString());
    }

    return this.httpClient.get<PaginateResponse<Subject>>(url.toString());
  }

  getAllSubjects({ page }: { page: number }) {
    const url = new URL(`${this.apiUrl}/all`);
    if (page) {
      url.searchParams.set('page', page.toString());
    }

    return this.httpClient.get<PaginateResponse<Subject>>(url.toString());
  }

  createSubject(subject: SubjectCreate) {
    return this.httpClient.post<Subject>(this.apiUrl, subject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }

  updateSubject(subjectId: string, subject: SubjectCreate) {
    const url = new URL(`${this.apiUrl}/${subjectId}`);

    return this.httpClient.put<Subject>(url.toString(), subject).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }

  deleteSubject(subjectId: string) {
    const url = new URL(`${this.apiUrl}/${subjectId}`);

    return this.httpClient.delete<Subject>(url.toString()).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      }),
    );
  }
}
