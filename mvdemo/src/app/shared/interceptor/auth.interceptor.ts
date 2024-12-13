import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, filter, take, tap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { IdleService } from '../services/idle.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private idleService: IdleService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isS3Request = request.url.includes('s3.amazonaws.com');
    const token = localStorage.getItem('auth_token');

    // Clone the request to add the Authorization header
    let authReq = request;
    if (token && !isS3Request) {
      authReq = this.addTokenHeader(request, token);
    }

    return next.handle(authReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const newToken = event.headers.get('Authorization');
          if (newToken) {
            this.storeNewToken(newToken.replace('Bearer ', ''));
          }
        }
      }),
      // catchError((error: HttpErrorResponse) => {
      //   if (error.status === 401) {

      //     if (error.url.includes('auth/refresh-token') && error.status == 401) {
      //       this.authService.logout();
      //       return throwError(() => 'Token refresh failed, logging out');
      //     } else {
      //       return this.handle401Error(authReq, next); // Handle token refresh logic
      //     }

      //   } else {
      //     return throwError(() => error); // For other errors, just propagate them
      //   }
      // })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private storeNewToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          const newToken = response?.data?.token;
          if (newToken) {
            this.storeNewToken(newToken);
            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addTokenHeader(request, newToken)); // Retry with new token
          } else {
            console.error('No token in refresh response, logging out...');
            this.authService.logout(); // Log out if no token received
            return throwError(() => 'Token refresh failed, logging out');
          }
        }),
        catchError((err) => {
          console.error('Refresh token request failed, logging out...', err);
          this.authService.logout(); // Log out on refresh token failure
          return throwError(() => 'Token refresh failed, logging out');
        }),
        finalize(() => {
          this.isRefreshingToken = false; // Ensure flag is reset
        })
      );
    } else {
      // Wait for the token to be refreshed and retry the request
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token as string)))
      );
    }
  }
}
