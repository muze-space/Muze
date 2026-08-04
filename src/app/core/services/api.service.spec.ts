import { TestBed } from '@angular/core/testing';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('get() returns the response body on success', () => {
    let result: { foo: string } | undefined;

    service.get<{ foo: string }>('https://example.com/api', new HttpParams()).subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne('https://example.com/api');
    expect(req.request.method).toBe('GET');
    req.flush({ foo: 'bar' });

    expect(result).toEqual({ foo: 'bar' });
  });

  it('get() maps a 404 response to a friendly error message', () => {
    let error: string | undefined;

    service.get<unknown>('https://example.com/api', new HttpParams()).subscribe({
      error: (err) => (error = err),
    });

    const req = httpMock.expectOne('https://example.com/api');
    req.flush('not found', { status: 404, statusText: 'Not Found' });

    expect(error).toBe('Resource not found (404).');
  });

  it('get() maps a 500 response to a friendly error message', () => {
    let error: string | undefined;

    service.get<unknown>('https://example.com/api', new HttpParams()).subscribe({
      error: (err) => (error = err),
    });

    const req = httpMock.expectOne('https://example.com/api');
    req.flush('server error', { status: 500, statusText: 'Internal Server Error' });

    expect(error).toBe('Server error (500). Please try again later.');
  });

  it('post() returns the response body on success', () => {
    let result: { ok: boolean } | undefined;

    service.post<{ id: string }, { ok: boolean }>('https://example.com/api', { id: '1' }, new HttpParams()).subscribe(
      (res) => {
        result = res;
      },
    );

    const req = httpMock.expectOne('https://example.com/api');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id: '1' });
    req.flush({ ok: true });

    expect(result).toEqual({ ok: true });
  });

  it('post() propagates a formatted error message on failure', () => {
    let error: string | undefined;

    service
      .post<{ id: string }, unknown>('https://example.com/api', { id: '1' }, new HttpParams())
      .subscribe({ error: (err) => (error = err) });

    const req = httpMock.expectOne('https://example.com/api');
    req.flush('not found', { status: 404, statusText: 'Not Found' });

    expect(error).toBe('Resource not found (404).');
  });
});
