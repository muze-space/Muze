import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';

import { AlbumPage } from './album';
import { API_CONFIG_TOKEN } from '../../core/tokens/api-config.token';
import { TracksResponse } from '../../core/models/tracks-response.model';

const BASE_URL = 'https://api.jamendo.com/v3.0/';

function albumResponse(albumName: string): TracksResponse {
  return {
    headers: {} as never,
    results: [{ id: '1', album_name: albumName } as never],
  };
}

describe('AlbumPage', () => {
  let fixture: ComponentFixture<AlbumPage>;
  let component: AlbumPage;
  let httpMock: HttpTestingController;
  let paramMap: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    paramMap = new BehaviorSubject(convertToParamMap({ id: 'album-1' }));

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AlbumPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: API_CONFIG_TOKEN, useValue: { baseUrl: BASE_URL, clientId: 'test-client' } },
        { provide: ActivatedRoute, useValue: { paramMap } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectTracksRequest() {
    return httpMock.expectOne((r) => r.url === `${BASE_URL}tracks/`);
  }

  it('requests the tracks of the album from the route', () => {
    fixture.detectChanges();

    const req = expectTracksRequest();
    expect(req.request.params.get('album_id')).toBe('album-1');
    req.flush(albumResponse('First'));

    expect(component['album']()?.album_name).toBe('First');
    expect(component['isLoading']()).toBe(false);
  });

  it('cancels the pending request when the route id changes', async () => {
    fixture.detectChanges();
    const stale = expectTracksRequest();

    paramMap.next(convertToParamMap({ id: 'album-2' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(stale.cancelled).toBe(true);

    const fresh = expectTracksRequest();
    expect(fresh.request.params.get('album_id')).toBe('album-2');
    fresh.flush(albumResponse('Second'));

    expect(component['album']()?.album_name).toBe('Second');
  });

  it('surfaces a failure and stops loading', () => {
    fixture.detectChanges();

    expectTracksRequest().flush('boom', { status: 500, statusText: 'Server Error' });

    expect(component['error']()).toBeTruthy();
    expect(component['isLoading']()).toBe(false);
  });
});
