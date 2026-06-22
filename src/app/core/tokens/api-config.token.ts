import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  baseUrl: string;
  clientId: string;
}

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfig>('API_CONFIG_TOKEN');

