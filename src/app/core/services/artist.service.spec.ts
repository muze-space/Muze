import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ArtistService } from './artist.service';
import { API_CONFIG_TOKEN } from '../tokens/api-config.token';
import { ArtistsResponse } from '../models/artists-response.model';
import { ArtistTracksResponse } from '../models/artist-tracks-response.model';
import { ArtistAlbumsResponse } from '../models/artist-albums-response.model';

const BASE_URL = 'https://api.jamendo.com/v3.0/';

describe('ArtistService', () => {
  let service: ArtistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIG_TOKEN, useValue: { baseUrl: BASE_URL, clientId: 'test-client' } },
      ],
    });

    service = TestBed.inject(ArtistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getArtist() requests the artist by id and returns the first result', () => {
    let result: unknown;
    service.getArtist('42').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}artists/`);
    expect(req.request.params.get('id')).toBe('42');
    expect(req.request.params.get('client_id')).toBe('test-client');

    const response: ArtistsResponse = {
      headers: {} as never,
      results: [{ id: '42', name: 'Test Artist' } as never],
    };
    req.flush(response);

    expect(result).toEqual({ id: '42', name: 'Test Artist' });
  });

  it('getArtist() returns undefined when there are no results', () => {
    let result: unknown;
    service.getArtist('42').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}artists/`);
    req.flush({ headers: {} as never, results: [] } as ArtistsResponse);

    expect(result).toBeUndefined();
  });

  it('getArtistTracks() maps raw artist tracks into Track objects', () => {
    let result: unknown;
    service.getArtistTracks('42').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}artists/tracks/`);
    const response: ArtistTracksResponse = {
      headers: {} as never,
      results: [
        {
          id: '42',
          name: 'Test Artist',
          tracks: [
            {
              album_id: 'album-1',
              album_name: 'Album',
              id: 'track-1',
              name: 'Song',
              duration: '180',
              releasedate: '2024-01-01',
              license_ccurl: '',
              album_image: '',
              image: '',
              audio: '',
              audiodownload: '',
              audiodownload_allowed: true,
            },
          ],
        } as never,
      ],
    };
    req.flush(response);

    expect(result).toEqual([
      expect.objectContaining({
        id: 'track-1',
        name: 'Song',
        duration: 180,
        artist_id: '42',
        artist_name: 'Test Artist',
      }),
    ]);
  });

  it('getArtistTracks() returns an empty array when there are no results', () => {
    let result: unknown;
    service.getArtistTracks('42').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}artists/tracks/`);
    req.flush({ headers: {} as never, results: [] } as ArtistTracksResponse);

    expect(result).toEqual([]);
  });

  it('getArtistAlbums() returns the albums for the first result', () => {
    let result: unknown;
    service.getArtistAlbums('42').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}artists/albums/`);
    const response: ArtistAlbumsResponse = {
      headers: {} as never,
      results: [
        {
          id: '42',
          name: 'Test Artist',
          albums: [{ id: 'album-1', name: 'Album', releasedate: '2024-01-01', image: '' }],
        } as never,
      ],
    };
    req.flush(response);

    expect(result).toEqual([{ id: 'album-1', name: 'Album', releasedate: '2024-01-01', image: '' }]);
  });

  it('getArtistAlbums() returns an empty array when there are no results', () => {
    let result: unknown;
    service.getArtistAlbums('42').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url === `${BASE_URL}artists/albums/`);
    req.flush({ headers: {} as never, results: [] } as ArtistAlbumsResponse);

    expect(result).toEqual([]);
  });
});
