import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from '../../types/Subject';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private apiUrl = 'http://localhost:3000/subjects';

  constructor(private httpClient: HttpClient) {}

  getSubject(id: string) {
    return this.httpClient.get<Subject>(`${this.apiUrl}/${id}`);
  }

  getSubjects() {
    return this.httpClient.get<Subject[]>(this.apiUrl);
  }

  getSubjectsVotedByUser() {
    return this.httpClient.get<Subject[]>(`${this.apiUrl}/my-votes`);
  }
}
