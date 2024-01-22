import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { VoteComponent } from './pages/vote/vote.component';
import { AuthGuard } from './resources/auth/auth.guard';
import { NoAuthGuard } from './resources/auth/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'vote/:id', component: VoteComponent, canActivate: [AuthGuard] },
];
