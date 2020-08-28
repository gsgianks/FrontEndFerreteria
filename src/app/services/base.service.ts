import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ResultBaseModel } from '../common/ResultBaseModel';
import { ResponseModel } from '../common/ResponseModel';

@Injectable({
    providedIn: 'root'
})

export class BaseService<T> {

    constructor(private http: HttpClient) {

    }

    getAll(method: string): Observable<ResponseModel<T>> {
        return this.http.get<ResponseModel<T>>(`${environment.urlService}/${method}`);
    }

    delete(method: string, id: number): Observable<ResultBaseModel> {
        return this.http.delete(`${environment.urlService}/${method}/${id}`).
        pipe(
            map((response: ResultBaseModel) => response)
        );
    }

    getById(method: string, id: number): Observable<ResponseModel<T>> {
        return this.http.get<ResponseModel<T>>(`${environment.urlService}/${method}/${id}`);
    }

    update(method: string, data: T): Observable<ResultBaseModel> {
        return this.http.put(`${environment.urlService}/${method}`, data)
            .pipe(
            map((response: ResultBaseModel) => response)
        );
    }

    insert(method: string, data: T): Observable<ResponseModel<T>> {
        return this.http.post(`${environment.urlService}/${method}`, data)
        .pipe(
          map((response: ResponseModel<T>) => response)
        );
      }
}
