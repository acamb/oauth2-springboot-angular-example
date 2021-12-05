import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, switchMap ,throwError} from 'rxjs';
import { catchError  } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshInProgress = false

  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem("token")
    let authRequest = request;
    if (token != null) {
      authRequest = this.addTokenHeader(request, token);
    }

    return next.handle(authRequest).pipe(
      catchError(
        error => {
          if(error instanceof HttpErrorResponse) {
            if (!authRequest.url.includes('auth/signin') && error.status === 401) {
              return this.handleRefresh(authRequest, next);
            }
                
            return throwError(() => new Error(error.message));
          } 
          return new Observable<HttpEvent<any>>();
        }
      )

    )
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set('Authorization', "Bearer " +token) });
  }

  private handleRefresh(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
      if(this.refreshInProgress){
        return new Observable<HttpEvent<any>>();
      }
      if (sessionStorage.getItem("refreshToken")){
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.refreshInProgress = false;

            sessionStorage.removeItem("token");
            sessionStorage.setItem("token",token);
            
            
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.refreshInProgress = false;
            
            this.authService.signOut();
            return throwError(() => new Error(err));
          })
        );
      }
      else{
        this.authService.signOut();
        return throwError(()=> new Error("Refresh token not found!"));
      }
  }

}
