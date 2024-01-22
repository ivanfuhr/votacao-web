import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectVotesService {
  private apiUrl = 'http://localhost:3000/subject-votes';
  private cache: any;

  constructor(private httpClient: HttpClient) {}

  createVote(subjectId: string, type: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/vote`, { type, subjectId });
  }
}
