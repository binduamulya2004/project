import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html', standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  styleUrls: ['./allusers.component.css'],
})
export class AllusersComponent implements OnInit {
  users: any[] = [];
  showUsersTable: boolean = true;
  editingIndex: number = -1;
  editObject: any = { id: 0, name: '', email: '', image: '' };

  constructor(private _router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers(); // Fetch users when component is initialized
  }

  fetchUsers(): void {
    this.http.get('http://localhost:3000/users').subscribe(
      (response: any) => {
        this.users = response;

        console.log("users: " ,this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }


  editUser(index: number): void {
    this.editingIndex = index;
    this.editObject = { ...this.users[index] };
  }

  saveEdit() {
    if (this.editingIndex !== -1) {
      const userId = this.users[this.editingIndex].id;
      const updatedUser = {
        id: userId,
        name: this.editObject.name,
        email: this.editObject.email,
        image: this.editObject.image,
      };

      this.http.put(`http://localhost:3000/users/${userId}`, updatedUser).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.users[this.editingIndex] = { ...this.editObject };
          this.editingIndex = -1;
          this.editObject = { id: -1, name: '', email: '', image: '' }; // Reset object
        },
        error: () => {
          alert('Failed to update user.');
        },
      });
    }
  }

  cancelEdit() {
    this.editingIndex = -1;
    this.editObject = { id: -1, name: '', email: '', image: '' };
  }

  deleteUser(index: number) {
    const userId = this.users[index].id;
    this.http.delete(`http://localhost:3000/users/${userId}`).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.users.splice(index, 1);
      },
      error: () => alert('Failed to delete user.'),
    });
  }

  uploadImage(event: any, userId: number) {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    formData.append('userId', userId.toString());

    this.http.post('http://localhost:3000/uploadImage', formData).subscribe({
      next: (response: any) => {
        alert('Image uploaded successfully');
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.image = response.user.image; // Update the image URL in the user object
          this.editObject.image = response.user.image; // Update the edit object
        }
      },
      error: () => {
        alert('Failed to upload image');
      },
    });
  }
}
