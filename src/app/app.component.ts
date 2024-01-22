import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandComponent } from './components/brand/brand.component';
import { ToastComponent } from './components/toast/toast.component';
import { AuthGuard } from './resources/auth/auth.guard';
import { AuthService } from './resources/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, BrandComponent],
  templateUrl: './app.component.html',
  providers: [AuthGuard, AuthService],
})
export class AppComponent {
  title = 'web';
  user: any;

  constructor(private readonly authService: AuthService) {
    this.authService.getUser().subscribe((user: any) => {
      this.user = user;
    });
  }
}
