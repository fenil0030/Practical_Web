import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthUtils } from 'src/app/core/auth.utils';
import { CookieService } from 'ngx-cookie-service';
import { LocalStoreService } from 'src/app/core/local-store.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthService {
  private baseUrl: string = environment.baseUrl + '/api/';
  private accessUrl: string = environment.accessUrl;


  /**
   * Constructor
   */
  constructor(
    private ls: LocalStoreService,
    private _httpClient: HttpClient,
    private _router: Router,
    private snack: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem(environment.appJwtTokenName, token);
  }

  get accessToken(): string {
    return localStorage.getItem(environment.appJwtTokenName) ?? '';
  }

  getUser() {
    return JSON.parse(AuthUtils.decryptAES(this.ls.getItem(environment.appName), this.accessUrl));
  }

  setUser(user: any) {
    this.ls.setItem(environment.appName, AuthUtils.encryptAES(JSON.stringify(user), this.accessUrl));
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  signIn(name: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${this.baseUrl}Account/SignIn`, { userName: name, password: password }).subscribe({
        next: async (response: any) => {
          if (response && Boolean(response.meta["status"])) {
            // this.setUserRights(response.webRights);
            this.accessToken = response.result.token;
            await this.setUser(response.result);
            // return of(response);
          }
          //show error
          resolve(response);
        },
        error: err => {
          console.log(err);
          this.handleError(err)
          reject(err);
        }
      });
    });
  }

  /**
 * Check the authentication status
 */
  check(): Observable<boolean> {
    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists and it didn't expire, Refresh it JwtToken
    // return this.RefreshJwtToken();//ideal check
    return of(true);
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem(environment.appJwtTokenName);
    this.setUser(null);

    // Return the observable
    return of(true);
  }


  private handleError(error: Response | any) {
    // this.spinner.hide();
    let errorMessage = '';
    console.log(error);

    if (error.status === 0) {
      this.snack.open('The server is not responding, Please contact your administrator for more details.', 'OK', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } else if (error.status === 400) {
      let errors;
      if (error._body) {
        errors = error._body;
      } else {
        errors = error.error.errors;
      }
      if (errors) {
        console.log(errors);

        // Swal.fire('', errors[0].errorMessage, 'error');

        //errors.forEach((errorItem: any) => {
        // Swal.fire({
        //   icon: 'error',
        //   //title: 'Oops...',
        //   text: errorItem.errorMessage,
        //   // footer: '<a href>Why do I have this issue?</a>'
        // })
        // this.toastrService.error(errorItem.errorMessage, 'Error', { timeOut: 10000 });
        //console.error(errorItem);
        // });
      }
      return throwError(error);
    }
    // Handle 401 - Unauthorized
    if (error.status === 401 || error.status === 403) {
      // this.toastrService.warning('401(403) - Invalid token');
      console.error('401(403) - Invalid token');
      this.signOut();
      this._router.navigate(['/']).then();
      console.error(error);
      return throwError(errorMessage);
    }
    if (error.status === 409) {
      // Swal.fire({
      //   icon: 'error',
      //   //title: 'Oops...',
      //   text: error.errorMessage,
      //   // footer: '<a href>Why do I have this issue?</a>'
      // });
      return throwError(errorMessage);
    }
    const body = error._body || '';
    //errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
    //console.error(errorMessage);
    //this.toastrService.error(errorMessage, 'Error', { timeOut: 10000 });
    return throwError(errorMessage);
  }
}
