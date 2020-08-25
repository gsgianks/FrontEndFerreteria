import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Product } from '../domain/Product';
import { ResultBaseModel } from '../common/ResultBaseModel';
import { ResponseModel } from '../common/ResponseModel';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    constructor(private http: HttpClient) {

    }

    getAll(): Observable<ResponseModel<Product>> {
        return this.http.get<ResponseModel<Product>>(`${environment.urlService}/Producto`);
    }

    delete(id: number): Observable<ResultBaseModel> {
        return this.http.delete(`${environment.urlService}/Producto/${id}`).
        pipe(
            map((response: ResultBaseModel) => response)
        );
    }

    getById(id: number): Observable<ResponseModel<Product>> {
        return this.http.get<ResponseModel<Product>>(`${environment.urlService}/Producto/${id}`);
    }

    update(data: Product): Observable<ResultBaseModel> {
        return this.http.put(`${environment.urlService}/Producto`, data)
            .pipe(
            map((response: ResultBaseModel) => response)
        );
    }

    insert(data: Product): Observable<ResponseModel<Product>> {
        data.id = undefined;
        return this.http.post(`${environment.urlService}/Producto`, data)
        .pipe(
          map((response: ResponseModel<Product>) => response)
        );
    }
}
