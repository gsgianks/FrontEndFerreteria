import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { Role } from '../domain/role.enum';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import * as decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { User } from '../domain/User';
import { Result } from '../common/result';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CacheService {

  private readonly authProvider: (correoElectronico: string, contrasena: string) => Observable<IServerAuthResponse>;
  // tslint:disable-next-line: no-use-before-declare
  authStatus = new BehaviorSubject<IAuthStatus>(this.getItem('authStatus') || defaultAuthStatus);

  constructor(private http: HttpClient) {
    super();
    this.authStatus.subscribe(authStatus => {
      this.setItem('authStatus', authStatus);
    });
    this.authProvider = this.userAuthProvider;
   }

  private userAuthProvider( identificacion: string, contrasena: string): Observable<IServerAuthResponse> {
    return this.http.post<IServerAuthResponse>(`${environment.urlService}/token`, {identificacion, contrasena});
  }

  login(identificacion: string, contrasena: string): Observable<IAuthStatus> {
    this.logout();

    const loginResponse = this.authProvider(identificacion, contrasena).pipe(
      map(value => {
        this.setToken(value.access_Token);
        const result = decode(value.access_Token);
        this.setName(result.unique_name);
        return result as IAuthStatus;
      }),
      catchError(transformError)
    );

    loginResponse.subscribe(
      res => {
        this.authStatus.next(res);
      },
      err => {
        this.logout();
        return observableThrowError(err);
      }
    );
    return loginResponse;
  }

  logout() {
    this.clearToken();
    // tslint:disable-next-line: no-use-before-declare
    this.authStatus.next(defaultAuthStatus);
  }

  private setToken(jwt: string) {
    this.setItem('jwt', jwt);
  }

  getToken(): string {
    return this.getItem('jwt') || '';
  }

  private setName(user: string) {
    this.setItem('user', user);
  }

  getName(): string {
    return this.getItem('user') || '';
  }

  private clearToken() {
    this.removeItem('jwt');
    this.removeItem('user');
  }

  getAuthStatus(): IAuthStatus {
    return this.getItem('authStatus');
  }
}


export interface IAuthStatus {
  role: Role;
  primarysid: number;
  unique_name: string;
}

interface IServerAuthResponse {
  access_Token: string;
}

const defaultAuthStatus: IAuthStatus = {role: Role.None, primarysid: null, unique_name: null};
