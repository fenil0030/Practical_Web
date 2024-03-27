import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  userName: any;

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.userName = this._authService.getUser() ? 'Welcome back, ' + this._authService.getUser().name : 'Welcome, chief';
  }

}
