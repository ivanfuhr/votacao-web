import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { PaginateResponse } from '../../types/PaginateResponse';
import { UserAdmin } from '../../types/UserAdmin';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  singup(user: UserAdmin) {
    return this.httpClient.post<UserAdmin>(`${this.apiUrl}/singup`, user);
  }

  getUsers({ page = 1 }) {
    const url = new URL(this.apiUrl);
    if (page) {
      url.searchParams.append('page', String(page));
    }

    return this.httpClient.get<PaginateResponse<UserAdmin>>(url.toString());
  }

  getUser(id: string) {
    return this.httpClient.get<UserAdmin>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserAdmin) {
    return this.httpClient.post<UserAdmin>(this.apiUrl, user);
  }

  updateUser(id: string, user: UserAdmin) {
    return this.httpClient.put<UserAdmin>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string) {
    return this.httpClient.delete<UserAdmin>(`${this.apiUrl}/${id}`);
  }
}
