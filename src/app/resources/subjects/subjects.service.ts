import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private apiUrl = 'http://localhost:3000/subjects';
  private cache: any;

  constructor(private httpClient: HttpClient) {}

  getSubject(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${id}`);
  }

  getSubjects(): Observable<any> {
    if (this.cache) {
      return of(this.cache);
    }

    return this.httpClient.get(this.apiUrl).pipe(
      tap((data) => {
        this.cache = data;
      }),
    );
  }
}
