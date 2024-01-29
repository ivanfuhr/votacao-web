import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { ToastService } from '../../components/toast/toast.service';
import { User } from '../../types/User';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private tokenSubject = new BehaviorSubject<string>('');
  private userSubject = new BehaviorSubject<any>(null);

  jwtTokenKey = '@votacao/token';
  userKey = '@votacao/user';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private readonly toast: ToastService,
  ) {
    this.initialize();
  }

  private initialize() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.jwtTokenKey);
      const user = localStorage.getItem(this.userKey);

      if (token && user) {
        this.tokenSubject.next(token);
        this.userSubject.next(JSON.parse(user));
        this.revalidate().subscribe();
      }
    }
  }

  getTokenValue(): string {
    return this.tokenSubject.value;
  }

  isAuthenticatedUser(): boolean {
    return !!this.tokenSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  login({ document, password }: LoginUserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { document, password }).pipe(
      map((response: any) => {
        this.setLocalStorage(response.access_token, response.user);
        this.tokenSubject.next(response.access_token);
        this.userSubject.next(response.user);

        this.toast.show({
          message: 'Login realizado com sucesso!',
          type: 'success',
        });
        return response;
      }),
      catchError((error) => {
        this.toast.show({
          message: 'Erro ao realizar login!',
          type: 'error',
        });
        return throwError(error);
      }),
    );
  }

  revalidate(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/revalidate`, {}).pipe(
      map((response: any) => {
        this.tokenSubject.next(response.access_token);
        this.userSubject.next(response.user);
        this.setLocalStorage(response.access_token, response.user);

        return response;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.handleSessionExpiration();
        } else {
          this.toast.show({
            message: 'Erro ao revalidar a sessão!',
            type: 'error',
          });

          this.removeLocalStorage();
        }
        return throwError(error);
      }),
    );
  }

  logout(): void {
    this.removeLocalStorage();
    this.tokenSubject.next('');
    this.userSubject.next(null);

    this.toast.show({
      message: 'Logout realizado com sucesso!',
      type: 'success',
    });
  }

  private handleSessionExpiration() {
    this.removeLocalStorage();
    this.tokenSubject.next('');
    this.userSubject.next(null);
    this.toast.show({ message: 'Sessão expirada!', type: 'error' });
  }

  setLocalStorage(tokenValue: string, user: User) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.jwtTokenKey, tokenValue);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  removeLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.jwtTokenKey);
      localStorage.removeItem(this.userKey);
    }
  }
}
