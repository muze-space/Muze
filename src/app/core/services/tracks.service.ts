import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TracksResponse } from '../models/tracks-response.model';
import { HttpParams } from '@angular/common/http';
import { ApiResponseFormat } from '../enums/api-response-format.enum';
import { TrackOrder } from '../enums/track-order.enum';
import { TrackImageSize } from '../enums/track-image-size.enum';
import { API_ENDPOINTS } from '../constants/api-endpoints.const';
import { TrackGenre } from '../constants/genre.const';
import { API_CONFIG_TOKEN } from '../tokens/api-config.token';

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
      .set('order', options.order || TrackOrder.PopularityTotal)
      .set('imagesize', TrackImageSize.Size50);

    if (options.genre) {
      params = params.set('tags', options.genre.value);
    }

    if (options.search) {
      params = params.set('search', options.search);
    }

    return this._apiService.get<TracksResponse>(
      `${this._apiConfig.baseUrl}${API_ENDPOINTS.tracks}`,
      params,
    );
  }
}

export interface TrackRequestOption {
  order?: TrackOrder;
  genre?: TrackGenre;
  search?: string;
  limit?: number;
}
