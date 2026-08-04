import { ApiResponseHeaders } from './headers.model';
import { Artist } from './artist.model';

export interface ArtistsResponse {
  headers: ApiResponseHeaders;
  results: Artist[];
}
