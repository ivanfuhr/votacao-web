import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from '../../components/toast/toast.service';
import { User } from '../../types/User';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string>('');
  private userSubject = new BehaviorSubject<any>(null);

  jwtTokenKey = '@votacao/token';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private readonly toast: ToastService,
    private router: Router,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.jwtTokenKey);

      if (token) {
        this.tokenSubject.next(token);
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

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  login({ document, password }: LoginUserDTO): Observable<any> {
    return this.http
      .post('http://localhost:3000/auth/login', { document, password })
      .pipe(
        map((response: any) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.jwtTokenKey, response.access_token);
          }
          this.tokenSubject.next(response.access_token);
          this.userSubject.next(response.user);

          this.toast.show({
            message: 'Login realizado com sucesso!',
            type: 'success',
          });

          window.location.reload();
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        }),
      );
  }

  revalidate(): Observable<any> {
    return this.http.patch('http://localhost:3000/auth/revalidate', {}).pipe(
      map((response: any) => {
        this.tokenSubject.next(response.access_token);
        this.userSubject.next(response.user);

        return response;
      }),
      catchError((error) => {
        if (error.status === 401) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.jwtTokenKey);
          }
          this.tokenSubject.next('');
          this.userSubject.next(null);
          this.toast.show({ message: 'Sessão expirada!', type: 'error' });

          window.location.reload();
        }
        return throwError(error);
      }),
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.jwtTokenKey);
    }

    this.tokenSubject.next('');
    this.userSubject.next(null);

    this.toast.show({
      message: 'Logout realizado com sucesso!',
      type: 'success',
    });

    window.location.reload();
  }
}
