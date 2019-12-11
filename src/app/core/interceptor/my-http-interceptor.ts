import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../../modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../shared/services/language/language.service';
import { NotificationService } from '../../shared/services/notifications/notification.service';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,
        private languageService: LanguageService,
        private notifcationService: NotificationService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let ignore =
            typeof request.body === "undefined"
            || request.body === null
            || request.body.toString() === "[object FormData]" // <-- This solves your problem
            || request.headers.has("Content-Type");
        if (!window.navigator.onLine) {
            this.notifcationService.errorNotification('Please Check Your Internet Connection !!');
            return;
        }
        if (ignore) {
            request = request.clone({
                setHeaders: {
                    'content_language': 'all',
                    Authorization: `${this.authService.getToken()}`
                }
            });
            return next.handle(request);
        }

        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'content_language': 'all',
                Authorization: `${this.authService.getToken()}`
            }
        });

        return next.handle(request).pipe(
            //   catchError(x => this.handleAuthError(x))
        ); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        return throwError(err);
    }
}
