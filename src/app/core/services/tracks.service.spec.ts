import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TracksService } from './tracks.service';
import { API_CONFIG_TOKEN } from '../tokens/api-config.token';
import { TrackOrder } from '../enums/track-order.enum';
import { TracksResponse } from '../models/tracks-response.model';

const BASE_URL = 'https://api.jamendo.com/v3.0/';

function emptyResponse(): TracksResponse {
  return { headers: {} as never, results: [] };
}

function nonEmptyResponse(): TracksResponse {
  return { headers: {} as never, results: [{ id: '1' } as never] };
}

describe('TracksService', () => {
  let service: TracksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIG_TOKEN, useValue: { baseUrl: BASE_URL, clientId: 'test-client' } },
      ],
    });

    service = TestBed.inject(TracksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests tracks with the configured client id and default order', () => {
    service.getTracks({}).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('client_id')).toBe('test-client');
    expect(req.request.params.get('order')).toBe(TrackOrder.PopularityTotal);
    req.flush(nonEmptyResponse());
  });

  it('includes the genre tag and search query when provided', () => {
    service.getTracks({ genre: { value: 'rock', label: 'Rock' }, search: 'daft punk' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('tags')).toBe('rock');
    expect(req.request.params.get('search')).toBe('daft punk');
    req.flush(nonEmptyResponse());
  });

  it('returns the response as-is when results are non-empty', () => {
    let result: TracksResponse | undefined;
    service.getTracks({}).subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    req.flush(nonEmptyResponse());

    expect(result?.results.length).toBe(1);
  });

  it('retries the request when the API returns an empty result set', async () => {
    let result: TracksResponse | undefined;
    service.getTracks({}).subscribe((res) => (result = res));

    const firstReq = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    firstReq.flush(emptyResponse());

    const secondReq = await vi.waitFor(() => httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`));
    secondReq.flush(nonEmptyResponse());

    expect(result?.results.length).toBe(1);
  });
});
