import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private _router: Router) {}

  createcourse(){
    this._router.navigate(['/create-course']);
  }
  displaycourse(){
    this._router.navigate(['/display-course']);
  }
}
