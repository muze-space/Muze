import { ApiResponseHeaders } from "./headers.model";
import { Track } from "./track.model";

export interface TracksResponse {
  headers: ApiResponseHeaders;
  results: Track[];
}
