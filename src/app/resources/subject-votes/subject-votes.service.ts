import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { VoteResults } from '../../types/VoteResults';

@Injectable({
  providedIn: 'root',
})
export class SubjectVotesService {
  private apiUrl = `${environment.apiUrl}/subject-votes`;
  private cache: any;

  constructor(private httpClient: HttpClient) {}

  createVote(subjectId: string, type: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/vote`, { type, subjectId });
  }

  getResults(subjectId: string) {
    return this.httpClient.get<VoteResults>(
      `${this.apiUrl}/results/${subjectId}`,
    );
  }
}
