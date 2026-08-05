import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Tracks } from './tracks';
import { API_CONFIG_TOKEN } from '../../../core/tokens/api-config.token';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { TracksResponse } from '../../../core/models/tracks-response.model';

const BASE_URL = 'https://api.jamendo.com/v3.0/';

function pageResponse(ids: string[], hasNext: boolean): TracksResponse {
  return {
    headers: { next: hasNext ? 'next-page-url' : '' } as never,
    results: ids.map((id) => ({ id, name: `Track ${id}` }) as never),
  };
}

describe('Tracks', () => {
  let fixture: ComponentFixture<Tracks>;
  let component: Tracks;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tracks],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIG_TOKEN, useValue: { baseUrl: BASE_URL, clientId: 'test-client' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tracks);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', TrackOrder.PopularityTotal);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the first page and exposes hasMore when the API reports a next page', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('offset')).toBe('0');
    req.flush(pageResponse(['1', '2'], true));

    expect(component.tracks().map((t) => t.id)).toEqual(['1', '2']);
    expect(component.hasMore()).toBe(true);
  });

  it('hasMore is false when the API reports no next page', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    req.flush(pageResponse(['1'], false));

    expect(component.hasMore()).toBe(false);
  });

  it('loadMore() appends the next page to the existing tracks', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1', '2'], true));

    component.loadMore();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('offset')).toBe('2');
    req.flush(pageResponse(['3', '4'], false));

    expect(component.tracks().map((t) => t.id)).toEqual(['1', '2', '3', '4']);
    expect(component.hasMore()).toBe(false);
  });

  it('loadMore() is a no-op when there is no next page', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1'], false));

    component.loadMore();

    httpMock.verify();
    expect(component.tracks().map((t) => t.id)).toEqual(['1']);
  });

  it('cancels the in-flight first page when the criteria change', async () => {
    fixture.detectChanges();
    const stale = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);

    fixture.componentRef.setInput('search', 'daft punk');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(stale.cancelled).toBe(true);

    const fresh = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(fresh.request.params.get('offset')).toBe('0');
    fresh.flush(pageResponse(['9'], false));

    expect(component.tracks().map((t) => t.id)).toEqual(['9']);
  });

  it('cancels an in-flight loadMore when the criteria change', async () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1', '2'], true));

    component.loadMore();
    const stale = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);

    fixture.componentRef.setInput('search', 'daft punk');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(stale.cancelled).toBe(true);
    expect(component.isLoadingMore()).toBe(false);

    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['3'], false));

    expect(component.tracks().map((t) => t.id)).toEqual(['3']);
  });

  function remount(inputs: Record<string, unknown> = {}): ComponentFixture<Tracks> {
    fixture.destroy();
    fixture = TestBed.createComponent(Tracks);
    fixture.componentRef.setInput('order', TrackOrder.PopularityTotal);

    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }

    component = fixture.componentInstance;
    fixture.detectChanges();

    return fixture;
  }

  it('reuses the cached list instead of refetching when remounted', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1', '2'], true));

    remount();

    httpMock.verify();
    expect(component.tracks().map((t) => t.id)).toEqual(['1', '2']);
    expect(component.hasMore()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('keeps the loaded pages so remounting does not fall back to the first page', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1', '2'], true));
    component.loadMore();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['3', '4'], true));

    remount();

    expect(component.tracks().map((t) => t.id)).toEqual(['1', '2', '3', '4']);

    component.loadMore();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('offset')).toBe('4');
    req.flush(pageResponse(['5'], false));

    expect(component.tracks().map((t) => t.id)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('fetches again when the remounted criteria differ from the cached ones', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1'], false));

    remount({ search: 'daft punk' });

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('search')).toBe('daft punk');
    req.flush(pageResponse(['9'], false));

    expect(component.tracks().map((t) => t.id)).toEqual(['9']);
  });

  it('reports the restored list to the parent', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1', '2'], true));

    fixture.destroy();
    fixture = TestBed.createComponent(Tracks);
    fixture.componentRef.setInput('order', TrackOrder.PopularityTotal);
    component = fixture.componentInstance;

    const loaded: string[][] = [];
    component.loaded.subscribe((tracks) => loaded.push(tracks.map((t) => t.id)));
    fixture.detectChanges();

    expect(loaded).toEqual([['1', '2']]);
  });

  it('does not cache a failed request', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((r) => r.url === `${BASE_URL}tracks/`)
      .flush('boom', { status: 500, statusText: 'Server Error' });

    remount();

    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1'], false));
    expect(component.tracks().map((t) => t.id)).toEqual(['1']);
  });

  it('stops loading and surfaces the message when the request fails', () => {
    fixture.detectChanges();

    httpMock
      .expectOne((r) => r.url === `${BASE_URL}tracks/`)
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);
  });

  it('changing the search input resets pagination and refetches from the first page', () => {
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`).flush(pageResponse(['1', '2'], true));

    fixture.componentRef.setInput('search', 'daft punk');
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
    expect(req.request.params.get('offset')).toBe('0');
    expect(req.request.params.get('search')).toBe('daft punk');
    req.flush(pageResponse(['3'], false));

    expect(component.tracks().map((t) => t.id)).toEqual(['3']);
  });
});
