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
export class LoginComponent implements OnInit {
  activeform: 'login' | 'register' = 'register';
  registerobj: RegisterModel = { id: 0,name: '', email: '', password: '' };
  loginobj: LoginModel = { email: '', password: '' };
  showUsersTable = false;
  users: RegisterModel[] = [];
 
  // For edit functionality
  editingIndex:  number  = -1;  // Index of the user being edited
  editObject: RegisterModel = { id: 0, name: '', email: '', password: '' };  // Object for editing user
 
  constructor(private _router: Router, private http: HttpClient) { }
 
  ngOnInit() {
    this.fetchUsers();
  }
 
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
          this.fetchUsers();
        },
        error: (error: any) => {
          alert(error.error.message);
        }
      });
  }
 
  // Fetch users
  fetchUsers() {
this.http.get('http://localhost:3000/users').subscribe({
      next: (response: any) => {
        this.users = response;
        this.showUsersTable = true;
      },
      error: (error: any) => {
        alert('Failed to fetch users.');
      },
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
          this.fetchUsers();
        },
        error: (error: any) => {
          alert(error.error.message);
        }
      });
  }
 
  // Start editing user
  editUser(index: number): void {
    this.editingIndex = index;
    this.editObject = { ...this.users[index] };  // Copy user data to editObject
  }
 
  // Save edited user
// Save edited user
saveEdit() {
  if (this.editingIndex !== -1) {
    const userId = this.users[this.editingIndex].id;
    const updatedUser = {
      id: userId,
      name: this.editObject.name,
      email: this.editObject.email
    };

    // Send updated user to the backend
    this.http.put(`http://localhost:3000/users/${userId}`, updatedUser)
      .subscribe({
        next: (response: any) => {
          alert(response.message);

          // Update the local users array to reflect changes
          this.users[this.editingIndex] = { ...this.editObject };
          
          // Reset editing index and editObject
          this.editingIndex = -1; // Exit editing mode
          this.editObject = { id: -1, name: '', email: '', password: '' }; // Clear edit object
        },
        error: () => {
          alert('Failed to update user.');
        }
      });
  }
}

 
  // Cancel editing
  cancelEdit() {
    this.editingIndex = -1;  // Exit editing mode
    this.editObject = { id: -1,name: '', email: '', password: '' };  // Clear edit object
  }
 
  // Delete user
deleteUser(index: number) {
    const userId = this.users[index].id;
this.http.delete(`http://localhost:3000/users/${userId}`)
      .subscribe({
        next: (response) => {
          alert('user deleted succesfully');
          this.users.splice(index, 1);
        },
        error: () => alert('Failed to delete user.'),
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