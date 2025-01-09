import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { DisplayCourseComponent } from './display-course/display-course.component';
import { HomeComponent } from './home/home.component';
import { AllusersComponent } from './allusers/allusers.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'create-course',
    loadComponent: () =>
      import('./create-course/create-course.component').then((m) => m.CreateCourseComponent),
  },
  {
    path: 'display-course',
    loadComponent: () =>
      import('./display-course/display-course.component').then((m) => m.DisplayCourseComponent),
  },
  {
    path: 'allusers',
    loadComponent: () =>
      import('./allusers/allusers.component').then((m) => m.AllusersComponent),
  },
];
