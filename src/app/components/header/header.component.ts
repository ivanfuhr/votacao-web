import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../types/User';
import { BrandComponent } from '../brand/brand.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BrandComponent, CommonModule, MenuComponent],
  template: `<header class="bg-zinc-50" *ngIf="user">
    <div
      class="mx-auto flex max-w-screen-lg items-center justify-between px-8 py-6"
    >
      <app-brand />
      <app-menu />
    </div>
  </header>`,
})
export class HeaderComponent {
  @Input() user: User | undefined;
}
