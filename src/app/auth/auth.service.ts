import { Injectable } from '@angular/core';
import { Role } from '../domain/role.enum';
import { Observable, BehaviorSubject, throwError as observableThrowError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import * as decode from 'jwt-decode';
import { transformError } from '../common/common';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CacheService {

  private readonly authProvider: (correoElectronico: string, contrasena: string) => Observable<IServerAuthResponse>;
  authStatus = new BehaviorSubject<IAuthStatus>(this.getItem('authStatus') || defaultAuthStatus);

  constructor(private httpClient: HttpClient) {
    super();
    this.authStatus.subscribe(authStatus => {
      this.setItem('authStatus', authStatus);
    });
    this.authProvider = this.userAuthProvider;
  }

  private userAuthProvider( correoElectronico: string, contrasena: string): Observable<IServerAuthResponse> {
    return this.httpClient.post<IServerAuthResponse>(`${environment.urlService}/token`, {correoElectronico, contrasena });
  }

  login(correoElectronico: string, contrasena: string): Observable<IAuthStatus> {
    this.logout();

    const loginResponse = this.authProvider(correoElectronico, contrasena).pipe(
      map(value => {
        this.setToken(value.access_Token);
        const result = decode(value.access_Token);
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
    this.authStatus.next(defaultAuthStatus);
  }

  private setToken(jwt: string) {
    this.setItem('jwt', jwt);
  }

  getName(): string {
    return this.getItem('user') || '';
  }

  getToken(): string {
    return this.getItem('jwt') || '';
  }

  private clearToken() {
    this.removeItem('jwt');
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

const defaultAuthStatus: IAuthStatus = {role: Role.None, primarysid: null, unique_name: null };
