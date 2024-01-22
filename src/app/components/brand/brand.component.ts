import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [RouterModule],
  template: `<a [routerLink]="['/']" class="w-fit"
    ><h1 class="w-fit text-nowrap  text-3xl font-bold ">
      Vota <span class="rounded bg-zinc-900 p-2 text-zinc-100 ">Fácil</span>
    </h1></a
  >`,
})
export class BrandComponent {}
