import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MyVotesComponent } from './pages/my-votes/my-votes.component';
import { SubjectsHomeComponent } from './pages/subjects/home/subjects-home.component';
import { SubjectsSaveComponent } from './pages/subjects/save/subjects-save.component';
import { VoteComponent } from './pages/vote/vote.component';
import { AuthAdminGuard } from './resources/auth/auth-admin.guard';
import { AuthGuard } from './resources/auth/auth.guard';
import { NoAuthGuard } from './resources/auth/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'votar/:id', component: VoteComponent, canActivate: [AuthGuard] },
  { path: 'meus-votos', component: MyVotesComponent, canActivate: [AuthGuard] },
  {
    path: 'pautas',
    children: [
      {
        path: 'criar',
        component: SubjectsSaveComponent,
      },
      {
        path: 'editar/:id',
        component: SubjectsSaveComponent,
      },
      { path: '', component: SubjectsHomeComponent },
      { path: ':page', component: SubjectsHomeComponent },
    ],
    canActivate: [AuthAdminGuard],
  },
];
