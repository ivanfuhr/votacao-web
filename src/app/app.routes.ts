import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MyVotesComponent } from './pages/my-votes/my-votes.component';
import { RegisterComponent } from './pages/register/register.component';
import { SubjectCategoriesHomeComponent } from './pages/subject-categories/home/subject-categories-home.component';
import { SubjectCategoriesSaveComponent } from './pages/subject-categories/save/subject-categories-save.component';
import { SubjectsHomeComponent } from './pages/subjects/home/subjects-home.component';
import { SubjectsSaveComponent } from './pages/subjects/save/subjects-save.component';
import { UsersHomeComponent } from './pages/users/home/users-home.component';
import { UsersSaveComponent } from './pages/users/save/users-save.component';
import { VoteComponent } from './pages/vote/vote.component';
import { AuthAdminGuard } from './resources/auth/auth-admin.guard';
import { AuthGuard } from './resources/auth/auth.guard';
import { NoAuthGuard } from './resources/auth/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'votacao', component: HomeComponent },
      { path: 'votacao/:page', component: HomeComponent },
      { path: 'votacao/categoria/:search', component: HomeComponent },
      { path: 'votacao/categoria/:search/:page', component: HomeComponent },
    ],
    canActivate: [],
  },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: 'registrar',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'votar/:id',
    component: VoteComponent,
    canActivate: [],
  },
  {
    path: 'meus-votos',
    children: [
      { path: '', component: MyVotesComponent },
      { path: ':page', component: MyVotesComponent },
    ],
    canActivate: [AuthGuard],
  },
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
  {
    path: 'categorias',
    children: [
      {
        path: 'criar',
        component: SubjectCategoriesSaveComponent,
      },
      {
        path: 'editar/:id',
        component: SubjectCategoriesSaveComponent,
      },
      { path: '', component: SubjectCategoriesHomeComponent },
    ],
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'usuarios',
    children: [
      {
        path: 'criar',
        component: UsersSaveComponent,
      },
      {
        path: 'editar/:id',
        component: UsersSaveComponent,
      },
      { path: '', component: UsersHomeComponent },
      { path: ':page', component: UsersHomeComponent },
    ],
    canActivate: [AuthAdminGuard],
  },
];
