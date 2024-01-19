import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { AuthGuard } from './resources/auth/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  providers: [AuthGuard],
})
export class AppComponent {
  title = 'web';
}
