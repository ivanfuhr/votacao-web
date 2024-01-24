import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../resources/auth/auth.service';
import { User } from '../../types/User';
import { BrandComponent } from '../brand/brand.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, BrandComponent, RouterModule],
  providers: [],
  standalone: true,
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  isOpen: boolean = false;
  user: User | undefined = undefined;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => (this.user = user));
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
  }
}
