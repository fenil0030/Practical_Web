import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<void>();
  user: any;
  constructor(private readonly router: Router, private _authService: AuthService) { }

  ngOnInit() {
    this.user = this._authService.getUser() ? this._authService.getUser() : {} as any;
  }

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  onLoginLoggedoutBtn() {
    if (this._authService.getUser()) {
      this._authService.signOut().subscribe((res) => {
        if (this.router.url == '/') {
          location.reload();
        } else {
          this.router.navigateByUrl('').then(() => {
            this.router.navigated = false;
            this.router.navigate([this.router.url]);
          });
        }
      });
    } else {
      this.router.navigateByUrl('/login').then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
    }

  }
}
