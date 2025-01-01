import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // TypeScript Union Type
  // let variable: Type1 | Type2 | Type3 = value;


  activeform: 'login' | 'register' = 'register';
  registerobj: registermodel = new registermodel();
  loginobj: loginmodel = new loginmodel();

  constructor(private _router: Router, private http:HttpClient) {}

  toggleform(form: 'login' | 'register') {
    this.activeform = form;
  }



//using localStorage
//   registerform() {
//     const localusers = localStorage.getItem('users');
//     const users = localusers ? JSON.parse(localusers) : [];

//     const isUserExist = users.find((user: registermodel) => user.email === this.registerobj.email);
//     if (isUserExist) {
//       alert('Email already exists!');
//     } else {
//       users.push(this.registerobj);
//       localStorage.setItem('users', JSON.stringify(users));
//       alert('User Registered Successfully');
//       this.toggleform('login');
//     }
//   }

//   loginform() {
//     const localusers = localStorage.getItem('users');
//     if (localusers) {
//       const users = JSON.parse(localusers);
//       const isUserExist = users.find(
//         (user: registermodel) => user.email === this.loginobj.email && user.password === this.loginobj.password
//       );

//       if (isUserExist) {
//         alert('Login Successful');
//         this._router.navigateByUrl('/dashboard');
//       } else {
//         alert('Invalid Credentials!');
//       }
//     } else {
//       alert('No registered users found!');
//     }
//   }

// }



//using server node js and mysql
// registerform() {
//   const localusers = localStorage.getItem('users');
//   const users = localusers ? JSON.parse(localusers) : [];

//   const isUserExist = users.find((user: registermodel) => user.email === this.registerobj.email);
//   if (isUserExist) {
//     alert('Email already exists!');
//   } else {
//     users.push(this.registerobj);
//     localStorage.setItem('users', JSON.stringify(users));
//     alert('User Registered Successfully');
//     this.toggleform('login');
//   }
// }

// loginform() {
//   const localusers = localStorage.getItem('users');
//   if (localusers) {
//     const users = JSON.parse(localusers);
//     const isUserExist = users.find(
//       (user: registermodel) => user.email === this.loginobj.email && user.password === this.loginobj.password
//     );

//     if (isUserExist) {
//       alert('Login Successful');
//       this._router.navigateByUrl('/dashboard');
//     } else {
//       alert('Invalid Credentials!');
//     }
//   } else {
//     alert('No registered users found!');
//   }
// }


  // Register form submission
  
  
  
  registerform() {
    this.http.post('http://localhost:3000/register', this.registerobj)
      .subscribe({
        next: (response: any) => {
          alert(response.message);  // Show success message
          this.toggleform('login');  // Switch to login form
        },
        error: (error) => {
          alert(error.error.message);  // Show error message
        }
      });
  }
 
  // Login form submission
  loginform() {
    this.http.post('http://localhost:3000/login', this.loginobj)
      .subscribe({
        next: (response: any) => {
          alert(response.message);  // Show success message
          this._router.navigate(['/dashboard']);  // Redirect to dashboard on successful login
         
          localStorage.setItem('token', response.token);  // Store token in local storage
           },
        error: (error) => {
          alert(error.error.message);  // Show error message
        }
      });
  }
}



export class registermodel {
  name: string;
  email: string;
  password: string;
  constructor() {
    this.email = '';
    this.name = '';
    this.password = '';
  }
}

export class loginmodel {
  email: string;
  password: string;
  constructor() {
    this.email = '';
    this.password = '';
  }
}





