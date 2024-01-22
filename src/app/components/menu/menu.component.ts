import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../resources/auth/auth.service';
import { BrandComponent } from '../brand/brand.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, BrandComponent, RouterModule],
  providers: [AuthService],
  standalone: true,
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  isOpen: boolean = false;
  constructor(
    private readonly authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
  }
}
