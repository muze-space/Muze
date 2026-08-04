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
import { ArtistTracksResponse, ArtistTracksResult } from '../models/artist-tracks-response.model';
import { ArtistAlbum, ArtistAlbumsResponse } from '../models/artist-albums-response.model';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private readonly _apiService = inject(ApiService);
  private readonly _apiConfig = inject(API_CONFIG_TOKEN);

  getArtist(artistId: string): Observable<Artist | undefined> {
    const params = this.buildParams(artistId, TrackImageSize.Size300);

    return this._apiService
      .get<ArtistsResponse>(`${this._apiConfig.baseUrl}${API_ENDPOINTS.artists}`, params)
      .pipe(map((response) => response.results[0]));
  }

  getArtistTracks(artistId: string): Observable<Track[]> {
    const params = this.buildParams(artistId, TrackImageSize.Size50);

    return this._apiService
      .get<ArtistTracksResponse>(`${this._apiConfig.baseUrl}${API_ENDPOINTS.artistTracks}`, params)
      .pipe(map((response) => this.mapArtistTracks(response.results[0])));
  }

  getArtistAlbums(artistId: string): Observable<ArtistAlbum[]> {
    const params = this.buildParams(artistId, TrackImageSize.Size300);

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

  private mapArtistTracks(result?: ArtistTracksResult): Track[] {
    if (!result) {
      return [];
    }

    return result.tracks.map((track) => ({
      id: track.id,
      name: track.name,
      duration: Number(track.duration),
      artist_id: result.id,
      artist_name: result.name,
      artist_idstr: '',
      album_name: track.album_name,
      album_id: track.album_id,
      license_ccurl: track.license_ccurl,
      position: 0,
      releasedate: track.releasedate,
      album_image: track.album_image,
      audio: track.audio,
      audiodownload: track.audiodownload,
      prourl: '',
      shorturl: '',
      shareurl: '',
      waveform: '',
      image: track.image,
      audiodownload_allowed: track.audiodownload_allowed,
      content_id_free: false,
    }));
  }
}
