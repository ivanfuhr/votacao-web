import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../components/toast/toast.service';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private authSecretKey = '@votacao/token';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private readonly toast: ToastService,
    private router: Router,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
    }
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  login({ document, password }: LoginUserDTO): void {
    this.http
      .post('http://localhost:3000/auth/login', { document, password })
      .subscribe((response: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.authSecretKey, response.access_token);
        }

        this.isAuthenticated = true;
        this.router.navigate(['/']);
      });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.authSecretKey);
    }
    this.isAuthenticated = false;
  }
}
