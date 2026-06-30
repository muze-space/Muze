import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _httpClient = inject(HttpClient);

  get<T>(url: string, params: HttpParams): Observable<T> {
    return this._httpClient.get<T>(url, { params }).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => this.formatErrorMessage(error));
      }),
    );
  }

  post<B, R>(url: string, body: B, params: HttpParams): Observable<R> {
    return this._httpClient.post<R>(url, body, { params }).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return throwError(() => this.formatErrorMessage(error));
      }),
    );
  }

  private formatErrorMessage(error: unknown): string {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network.';
    }
    if (typeof error === 'object' && error !== null) {
      const httpError = error as { status: number; error?: { error_message?: string } };

      if (httpError.status === 0) {
        return 'Network error. Unable to reach the server.';
      }
      if (httpError.status === 404) {
        return 'Resource not found (404).';
      }
      if (httpError.status === 500) {
        return 'Server error (500). Please try again later.';
      }
      if (httpError.error?.error_message) {
        return httpError.error.error_message;
      }
    }
    return 'An error occurred while fetching data. Please try again.';
  }
}
