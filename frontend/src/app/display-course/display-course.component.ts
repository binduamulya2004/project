import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-display-course',
   standalone: true,
  templateUrl: './display-course.component.html',
  styleUrls: ['./display-course.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class DisplayCourseComponent implements OnInit {
 
  courses: any[] = [];
 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    this.fetchCourses();
  }
 
  fetchCourses() {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('token');
 
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });
 
      this.http.get('http://localhost:3000/courses').subscribe({
        next: (response: any) => {
          this.courses = response;
        },
        error: (error) => {
          console.log('Error fetching courses', error);
          alert('Error fetching courses');
        }
      });
    } else {
      alert('You must be logged in to view courses!');
    }

    console.log(this.courses);
  }
}
 