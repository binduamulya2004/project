import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  imports: [FormsModule],
})
export class CreateCourseComponent {
 
  course = {
    name: '',
    image: '',
    startDate: '',
    endDate: '',
    duration: '',
    rating: 0,
    mentor: ''
  };
 
  constructor(private http: HttpClient, private router: Router) {}
 
  submitCourse() {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('token');
   
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });
 
      this.http.post('http://localhost:3000/create-course', this.course, { headers }).subscribe({
        next: (response) => {
          console.log('Course Created Successfully!', response);
          alert('Course Created Successfully');
          this.router.navigate(['/display-course']);
        },
        error: (error) => {
          console.log('Error creating course', error);
          alert('Error creating course');
        }
      });
    } else {
      alert('You must be logged in to create a course!');
    }
  }
}