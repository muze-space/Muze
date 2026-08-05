import { Track } from './track.model';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  /** ISO timestamp. */
  createdAt: string;
  /**
   * Tracks are stored in full rather than by id: Jamendo has no endpoint for
   * fetching an arbitrary set of tracks by id, so a playlist page would
   * otherwise need one request per track.
   */
  tracks: Track[];
}
