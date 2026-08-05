import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_CONFIG_TOKEN } from '../tokens/api-config.token';
import { API_ENDPOINTS } from '../constants/api-endpoints.const';
import { ApiResponseFormat } from '../enums/api-response-format.enum';
import { TrackImageSize } from '../enums/track-image-size.enum';
import { Artist } from '../models/artist.model';
import { ArtistsResponse } from '../models/artists-response.model';
import { ArtistAlbum, ArtistAlbumsResponse } from '../models/artist-albums-response.model';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private readonly _apiService = inject(ApiService);
  private readonly _apiConfig = inject(API_CONFIG_TOKEN);

  getArtist(artistId: string): Observable<Artist | undefined> {
    const params = this.buildParams(artistId, TrackImageSize.Size400);

    return this._apiService
      .get<ArtistsResponse>(`${this._apiConfig.baseUrl}${API_ENDPOINTS.artists}`, params)
      .pipe(map((response) => response.results[0]));
  }

  getArtistAlbums(artistId: string): Observable<ArtistAlbum[]> {
    const params = this.buildParams(artistId, TrackImageSize.Size400);

    return this._apiService
      .get<ArtistAlbumsResponse>(`${this._apiConfig.baseUrl}${API_ENDPOINTS.artistAlbums}`, params)
      .pipe(map((response) => response.results[0]?.albums ?? []));
  }

  private buildParams(artistId: string, imageSize: TrackImageSize): HttpParams {
    return new HttpParams()
      .set('client_id', this._apiConfig.clientId)
      .set('format', ApiResponseFormat.JsonPretty)
      .set('id', artistId)
      .set('imagesize', imageSize);
  }
}
