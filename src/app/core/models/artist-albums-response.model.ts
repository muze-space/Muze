import { ApiResponseHeaders } from './headers.model';
import { Artist } from './artist.model';

export interface ArtistAlbum {
  id: string;
  name: string;
  releasedate: string;
  image: string;
}

export interface ArtistAlbumsResult extends Artist {
  albums: ArtistAlbum[];
}

export interface ArtistAlbumsResponse {
  headers: ApiResponseHeaders;
  results: ArtistAlbumsResult[];
}
