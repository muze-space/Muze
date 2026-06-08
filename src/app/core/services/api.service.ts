import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _httpClient = inject(HttpClient);

  get<T>(url: string, params: HttpParams): Observable<T> {
    return this._httpClient.get<T>(url, { params });
  }

  post<B, R>(url: string, body: B, params: HttpParams): Observable<R> {
    return this._httpClient.post<R>(url, body, { params });
  }
}
