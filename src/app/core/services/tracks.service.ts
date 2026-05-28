import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TracksResponse } from '../models/tracks-response.model';
import { API_CONFIG } from '../../config';
import { HttpParams } from '@angular/common/http';
import { ApiResponseFormat } from '../enums/api-response-format.enum';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private readonly _apiService = inject(ApiService);

  getPopularTracks() {
    const params = new HttpParams()
      .set('client_id', API_CONFIG.clientId)
      .set('format', ApiResponseFormat.JsonPretty)
      .set('limit', 10)
      .set('order', 'popularity_total');

    return this._apiService.get<TracksResponse>(
      `${API_CONFIG.baseUrl}${API_CONFIG.tracks}`,
      params,
    );
  }
}
