import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, SkipSelf } from '@angular/core';
// import Swal from 'sweetalert2';
// import { AuthUtils } from './auth/auth.utils';
import { environment } from 'src/environments/environment';
import { AuthUtils } from './auth.utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CoreHttpService {
  constructor(
    @SkipSelf() private http: HttpClient,
    private snack: MatSnackBar,
    private router: Router
  ) { }
  protected get<T>(method: string, params?: any): Observable<any> {
    this.checkInternet();
    return this.http
      .get(method, {
        headers: this.setHeaders(),
        params: this.setParams(params),
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((err) => this.handleError(err))
      );
  }

  protected getBlobData<T>(method: string): Observable<any> {
    this.checkInternet();
    return this.http
      .get(method, {
        headers: this.setHeaders('formData'),
        responseType: 'blob',
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  protected getBlobDatapost<T>(method: string, body: any): Observable<any> {
    this.checkInternet();
    return this.http
      .post(method, body, {
        headers: this.setHeaders('formData'),
        responseType: 'blob',
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => this.handleError(err))
      );
  }

  protected post<T>(method: string, body: any): Observable<any> {
    this.checkInternet();
    const model = JSON.stringify(body);
    return this.http.post(method, model, { headers: this.setHeaders() }).pipe(
      map((response) => this.extractData<T>(response)),
      catchError((err) => this.handleError(err))
    );
  }

  protected delete<T>(method: string, params?: any): Observable<any> {
    this.checkInternet();
    return this.http
      .delete(method, {
        headers: this.setHeaders(),
        params: this.setParams(params),
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((err) => this.handleError(err))
      );
  }

  protected put<T>(method: string, body: any): Observable<any> {
    this.checkInternet();
    const model = JSON.stringify(body);
    return this.http.put(method, model, { headers: this.setHeaders() }).pipe(
      map((response) => this.extractData<T>(response)),
      catchError((err) => this.handleError(err))
    );
  }

  protected postFormData<T>(method: string, body: any): Observable<any> {
    this.checkInternet();
    return this.http
      .post(method, body, { headers: this.setHeaders('formData') })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((err) => this.handleError(err))
      );
  }

  private setHeaders(contentType?: string) {
    let headers = new HttpHeaders();
    if (contentType === 'formData') {
    } else if (contentType) {
      headers = headers.set('Content-Type', contentType);
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }
    let token = '';
    // headers = headers.set('Connection', 'close');
    var userData = localStorage.getItem("Job_Application");

    if (userData !== null && userData !== undefined && userData !== '') {
      token = localStorage.getItem('accessToken');
      if (!AuthUtils.isTokenExpired(token)) {
        headers = headers.append('Authorization', 'Bearer ' + token);
      }
    }
    return headers;
  }

  private setParams(params: any) {
    let httpParams = new HttpParams();
    if (!params) {
      return httpParams;
    }
    for (const param of Object.keys(params)) {
      if (params[param]) {
        httpParams = httpParams.set(param, params[param]);
      }
    }
    return httpParams;
  }

  private extractData<T>(res: any) {
    let body;
    try {
      body = res;
      // body.messages.forEach((message: any) => {
      //   //this.toastrService.info(message.messageText, message.title, { timeOut: 10000 });
      //   // console.log(message.messageText);
      // });
    } catch (e) {
      return {};
    }
    return <T>body;
  }

  private logOutWhenTokenFalse() {
    localStorage.clear();
    this.router.navigate(['/login']).then();
  }

  private handleError(error: Response | any) {
    // this.spinner.hide();
    let errorMessage = '';
    console.log(error);

    if (error.status === 0) {
      this.snack.open(`The server is not responding, Please contact your administrator for more details.`, 'OK', {
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

        this.snack.open(errors[0].errorMessage, 'OK', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        errors.forEach((errorItem: any) => {
          this.snack.open(errorItem.errorMessage, 'OK', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          console.error(errorItem);
        });
      }
      return throwError(error);
    }
    // Handle 401 - Unauthorized
    if (error.status === 401 || error.status === 403) {
      // this.toastrService.warning('401(403) - Invalid token');
      console.error('401(403) - Invalid token');
      this.logOutWhenTokenFalse();
      console.error(error);
      return throwError(errorMessage);
    }
    if (error.status === 409) {
      this.snack.open(error.errorMessage, 'OK', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return throwError(errorMessage);
    }
    const body = error._body || '';
    //errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
    //console.error(errorMessage);
    //this.toastrService.error(errorMessage, 'Error', { timeOut: 10000 });
    return throwError(errorMessage);
  }

  private checkInternet(): void {
    if (!window.navigator.onLine) {
      this.snack.open('No Internet Connection.', 'OK', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}
