import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserStorageService } from '../storage/user-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userStorage: UserStorageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only handle 401 (Unauthorized) - means token is invalid/expired
        // Skip auth endpoints (login/signup) from this check
        const isAuthEndpoint = request.url.includes('/api/auth/');

        if (error.status === 401 && !isAuthEndpoint) {
          // Token is invalid or expired - clear storage and redirect to login
          this.userStorage.signOut();
          this.router.navigateByUrl('/');
        }
        return throwError(() => error);
      })
    );
  }
}
