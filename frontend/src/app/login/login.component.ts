import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
 
 
export interface ApiResponse {
  message: string;
  token?: string;  // The token is only present in the login response
}
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  activeform: 'login' | 'register' = 'register';
  registerobj: RegisterModel = { id: 0,name: '', email: '', password: '' };
  loginobj: LoginModel = { email: '', password: '' };
 
  constructor(private _router: Router, private http: HttpClient) { }
 
  toggleform(form: 'login' | 'register') {
    this.activeform = form;
  }
 
  // Register form submission
  registerform() {
this.http.post('http://localhost:3000/register', this.registerobj)
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          this.toggleform('login');
        },
        error: (error: any) => {
          alert(error.error.message);
        }
      });
  }

 
  // Login form submission
  loginform() {
this.http.post('http://localhost:3000/login', this.loginobj)
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          this._router.navigate(['/dashboard']);
          localStorage.setItem('token', response.token);
        },
        error: (error: any) => {
          alert(error.error.message);
        }
      });
  }
 
  
}
export interface RegisterModel {
  id: number;
  name: string;
  email: string;
  password: string;
}
 
export interface LoginModel {
  email: string;
  password: string;
}