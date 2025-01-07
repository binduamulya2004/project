import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { DisplayCourseComponent } from './display-course/display-course.component';
import { HomeComponent } from './home/home.component';
import { AllusersComponent } from './allusers/allusers.component';
export const routes: Routes = [
    {
        path:'',redirectTo:'home',pathMatch:'full'

    },
    {
       path:'home',component:HomeComponent
   },
    {
        path:'login',component:LoginComponent
    },
    {

        path:'register',component:LoginComponent
    },
    {
        path: 'dashboard', component: DashboardComponent
    },
    { path: 'create-course', component: CreateCourseComponent },
    { path: 'display-course', component: DisplayCourseComponent },
    {
        path:'allusers',component:AllusersComponent
    }

];
