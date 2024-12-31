import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { DisplayCourseComponent } from './display-course/display-course.component';

export const routes: Routes = [
    {
        path:'',redirectTo:'login',pathMatch:'full'

    },
    {
        path:'login',component:LoginComponent
    },
    {
        path: 'dashboard', component: DashboardComponent
    },
    { path: 'create-course', component: CreateCourseComponent },
    { path: 'display-course', component: DisplayCourseComponent },


];
