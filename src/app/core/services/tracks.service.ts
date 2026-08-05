import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { ApiService } from './api.service';
import { TracksResponse } from '../models/tracks-response.model';
import { HttpParams } from '@angular/common/http';
import { ApiResponseFormat } from '../enums/api-response-format.enum';
import { TrackOrder } from '../enums/track-order.enum';
import { TrackImageSize } from '../enums/track-image-size.enum';
import { API_ENDPOINTS } from '../constants/api-endpoints.const';
import { TrackGenre } from '../constants/genre.const';
import { API_CONFIG_TOKEN } from '../tokens/api-config.token';

const EMPTY_RESULTS_MAX_RETRIES = 3;
const EMPTY_RESULTS_RETRY_DELAY_MS = 500;

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private readonly _apiService = inject(ApiService);
  private readonly _apiConfig = inject(API_CONFIG_TOKEN);

  getTracks(options: TrackRequestOption) {
    let params = new HttpParams()
      .set('client_id', this._apiConfig.clientId)
      .set('format', ApiResponseFormat.JsonPretty)
      .set('limit', options.limit || 10)
      .set('offset', options.offset ?? 0)
      .set('order', options.order || TrackOrder.PopularityTotal)
      .set('imagesize', options.imageSize || TrackImageSize.Size300);

    if (options.genre) {
      params = params.set('tags', options.genre.value);
    }

    if (options.search) {
      params = params.set('search', options.search);
    }

    if (options.albumId) {
      params = params.set('album_id', options.albumId);
    }

    if (options.artistId) {
      params = params.set('artist_id', options.artistId);
    }

    return this.retryOnEmptyResults(() =>
      this._apiService.get<TracksResponse>(`${this._apiConfig.baseUrl}${API_ENDPOINTS.tracks}`, params),
    );
  }

  private retryOnEmptyResults(
    request: () => Observable<TracksResponse>,
    retriesLeft = EMPTY_RESULTS_MAX_RETRIES,
  ): Observable<TracksResponse> {
    return request().pipe(
      switchMap((response) =>
        response.results.length === 0 && retriesLeft > 0
          ? timer(EMPTY_RESULTS_RETRY_DELAY_MS).pipe(
              switchMap(() => this.retryOnEmptyResults(request, retriesLeft - 1)),
            )
          : of(response),
      ),
    );
  }
}

export interface TrackRequestOption {
  order?: TrackOrder;
  genre?: TrackGenre;
  search?: string;
  limit?: number;
  offset?: number;
  albumId?: string;
  artistId?: string;
  imageSize?: TrackImageSize;
}
