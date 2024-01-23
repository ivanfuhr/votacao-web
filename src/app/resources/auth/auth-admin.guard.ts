import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastService } from '../../components/toast/toast.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  canActivate(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticatedUser() && this.authService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['/login']);

      this.toastService.show({
        message: 'Você não tem permissão para acessar essa página',
        type: 'error',
      });
      return false;
    }
  }
}
