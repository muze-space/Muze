import { Headers } from "./headers.model";
import { Track } from "./track.model";

export interface TracksResponse {
  headers: Headers;
  results: Track[];
}
