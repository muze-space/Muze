import { ApiResponseHeaders } from './headers.model';
import { Artist } from './artist.model';

export interface RawArtistTrack {
  album_id: string;
  album_name: string;
  id: string;
  name: string;
  duration: string;
  releasedate: string;
  license_ccurl: string;
  album_image: string;
  image: string;
  audio: string;
  audiodownload: string;
  audiodownload_allowed: boolean;
}

export interface ArtistTracksResult extends Artist {
  tracks: RawArtistTrack[];
}

export interface ArtistTracksResponse {
  headers: ApiResponseHeaders;
  results: ArtistTracksResult[];
}
