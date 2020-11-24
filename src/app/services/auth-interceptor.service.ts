import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Utilities } from './../helpers/utilities';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { DialogService } from './dialog.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient, 
    private utilities: Utilities,
  private dialog :DialogService,
  @Inject(PLATFORM_ID) private platformId: any
  ) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if(isPlatformBrowser(this.platformId)){

      const token = this.utilities.getUserToken();
      const clonedReq = req.clone({
        headers: new HttpHeaders({
          Authorization: token,
          lang: "en"
        })
      });
      return next.handle(clonedReq).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error.message) {
            errorMessage = error.error.message;
            // client-side error
            this.dialog.openDialog({ msg: errorMessage, justOk: true});
            // errorMessage = `Error: ${errorMessage}`;
          } else {
            if(error.status == 500)
            errorMessage = 'Something went wrong, please try again later.';
            else 
            errorMessage = error.message;
            // server-side error
            this.dialog.openDialog({ msg: errorMessage });
  
          }
          // window.alert(errorMessage);
          return throwError(errorMessage);
        })
      );
    // }

  }
}
