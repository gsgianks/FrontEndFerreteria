import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError as ObservableThrowError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()

export class AuthHttpInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt = this.authService.getToken();
        const authRequest = req.clone({setHeaders: {authorization: `bearer ${jwt}`
                                                    // , Allow : 'GET, POST, OPTIONS, PUT, DELETE'
                                                    // , 'Access-Control-Allow-Origin': '*'
                                                    // , 'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, ' +
                                                    // 'Content-Type, Accept, Access-Control-Request-Method'
                                                    // , 'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, DELETE'
                                                }});

        return next.handle(authRequest).pipe(
            catchError((err, caught) => {
                if (err.status === 401) {
                    this.router.navigate(['/login'], {
                        queryParams: {redirectUrl: this.router.routerState.snapshot.url}, }); }
                return ObservableThrowError(err);
            })
        );
    }
}
