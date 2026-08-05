import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ArtistPage } from './artist';
import { API_CONFIG_TOKEN } from '../../core/tokens/api-config.token';

const BASE_URL = 'https://api.jamendo.com/v3.0/';

function artistsResponse(name: string) {
  return { results: [{ id: 'artist-1', name }] };
}

function albumsResponse(names: string[]) {
  return { results: [{ albums: names.map((name, index) => ({ id: String(index), name })) }] };
}

describe('ArtistPage', () => {
  let fixture: ComponentFixture<ArtistPage>;
  let component: ArtistPage;
  let httpMock: HttpTestingController;
  let paramMap: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    paramMap = new BehaviorSubject(convertToParamMap({ id: 'artist-1' }));

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ArtistPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: API_CONFIG_TOKEN, useValue: { baseUrl: BASE_URL, clientId: 'test-client' } },
        { provide: ActivatedRoute, useValue: { paramMap } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    drainNestedTrackRequests();
    httpMock.verify({ ignoreCancelled: true });
  });

  function drainNestedTrackRequests(): void {
    httpMock
      .match((r) => r.url === `${BASE_URL}tracks/`)
      .filter((req) => !req.cancelled)
      .forEach((req) => req.flush({ headers: {}, results: [] }));
  }

  function expectArtistRequests() {
    return {
      artist: httpMock.expectOne((r) => r.url === `${BASE_URL}artists/`),
      albums: httpMock.expectOne((r) => r.url === `${BASE_URL}artists/albums/`),
    };
  }

  it('loads the artist and albums for the route id', async () => {
    fixture.detectChanges();

    const { artist, albums } = expectArtistRequests();
    expect(artist.request.params.get('id')).toBe('artist-1');
    artist.flush(artistsResponse('Daft Punk'));
    albums.flush(albumsResponse(['Discovery']));
    await fixture.whenStable();

    expect(component['artist']()?.name).toBe('Daft Punk');
    expect(component['albums']().map((album) => album.name)).toEqual(['Discovery']);
    expect(component['isLoading']()).toBe(false);
  });

  it('cancels the pending requests when the route id changes', async () => {
    fixture.detectChanges();
    const stale = expectArtistRequests();

    paramMap.next(convertToParamMap({ id: 'artist-2' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(stale.artist.cancelled).toBe(true);
    expect(stale.albums.cancelled).toBe(true);

    const fresh = expectArtistRequests();
    expect(fresh.artist.request.params.get('id')).toBe('artist-2');
    fresh.artist.flush(artistsResponse('Justice'));
    fresh.albums.flush(albumsResponse([]));
    await fixture.whenStable();

    expect(component['artist']()?.name).toBe('Justice');
  });

  it('collects the track list from the nested component for the play button', async () => {
    fixture.detectChanges();
    const { artist, albums } = expectArtistRequests();
    artist.flush(artistsResponse('Daft Punk'));
    albums.flush(albumsResponse([]));
    await fixture.whenStable();
    fixture.detectChanges();

    httpMock
      .expectOne((r) => r.url === `${BASE_URL}tracks/`)
      .flush({ headers: {}, results: [{ id: 't1' }, { id: 't2' }] });
    await fixture.whenStable();

    expect(component['artistTracks']().map((track) => track.id)).toEqual(['t1', 't2']);
  });

  it('surfaces a failure and stops loading', async () => {
    fixture.detectChanges();

    const { artist, albums } = expectArtistRequests();
    artist.flush('boom', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(albums.cancelled).toBe(true);
    expect(component['error']()).toBeTruthy();
    expect(component['isLoading']()).toBe(false);
  });
});
