import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CoreHelperService } from 'src/app/core/core-helper.service';
import { AppLoaderService } from 'src/app/shared/app-loader/app-loader.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName = new FormControl();
  passWord = new FormControl();
  constructor(private router: Router,
    private snack: MatSnackBar,
    private coreHelperService: CoreHelperService,
    private _authService: AuthService,
    private loader: AppLoaderService
    ) { }

  ngOnInit() { }
  // onLogin() {
  //   localStorage.setItem('isLoggedin', 'true');
  //   this.router.navigate(['/dashboard']);
  // }


  onLogin() {
    if (this.coreHelperService.isStringEmptyOrWhitespace(this.userName.value) || this.coreHelperService.isStringEmptyOrWhitespace(this.passWord.value)) {
      this.snack.open(`Please enter valid username or password`, 'OK', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return
    }
    this.loader.open();
    this._authService.signIn(this.userName.value, this.passWord.value).then(async (obj) => {
      if (obj && Boolean(obj.meta["status"])) {
        this.router.navigate(['/jobs']);
      } else {
        this.snack.open(String(obj.meta["message"]), 'OK', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
      // if (obj != null && obj.id > 0) {
      //   this.router.navigate(['/back-office/rights-group']);
      //   this._changeDetectorRef.markForCheck();
      // }
      this.loader.close();
    }, (err: any) => {
      if (err.status === 1) {
        this.snack.open(err.error, 'OK', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
      this.loader.close();
    })
  }
}
