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

    Api: string;

    constructor(private http: HttpClient) {

    }

    getAll(): Observable<ResponseModel<T>> {
        return this.http.get<ResponseModel<T>>(`${environment.urlService}/${this.Api}`);
    }

    delete(id: number): Observable<ResultBaseModel> {
        return this.http.delete(`${environment.urlService}/${this.Api}/${id}`).
        pipe(
            map((response: ResultBaseModel) => response)
        );
    }

    getById(id: number): Observable<ResponseModel<T>> {
        return this.http.get<ResponseModel<T>>(`${environment.urlService}/${this.Api}/${id}`);
    }

    update(data: T): Observable<ResultBaseModel> {
        return this.http.put(`${environment.urlService}/${this.Api}`, data)
            .pipe(
            map((response: ResultBaseModel) => response)
        );
    }

    insert(data: T): Observable<ResponseModel<T>> {
        return this.http.post(`${environment.urlService}/${this.Api}`, data)
        .pipe(
          map((response: ResponseModel<T>) => response)
        );
      }
}
