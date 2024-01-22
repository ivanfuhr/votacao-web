import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import { AuthGuard } from './resources/auth/auth.guard';
import { AuthService } from './resources/auth/auth.service';
import { User } from './types/User';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, HeaderComponent],
  templateUrl: './app.component.html',
  providers: [AuthGuard, AuthService],
})
export class AppComponent {
  title = 'web';
  user: User | undefined = undefined;

  constructor(private readonly authService: AuthService) {
    this.authService.getUser().subscribe((user: any) => {
      this.user = user;
    });
  }
}
