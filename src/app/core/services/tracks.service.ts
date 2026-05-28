import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TracksResponse } from '../models/tracks-response.model';
import { API_CONFIG } from '../../config';
import { HttpParams } from '@angular/common/http';
import { ApiResponseFormat } from '../enums/api-response-format.enum';
import { TrackOrder } from '../enums/track-order.enum';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private readonly _apiService = inject(ApiService);

  getTracks(order: TrackOrder, limit = 10) {
    const params = new HttpParams()
      .set('client_id', API_CONFIG.clientId)
      .set('format', ApiResponseFormat.JsonPretty)
      .set('limit', limit)
      .set('order', order);

    return this._apiService.get<TracksResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.tracks}`,
      params,
    );
  }
}
