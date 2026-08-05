import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { TrackCriteria } from '../models/track-criteria.model';

export interface CachedPages {
  tracks: Track[];
  offset: number;
  hasMore: boolean;
}

@Injectable({ providedIn: 'root' })
export class TracksCacheService {
  private readonly pages = new Map<string, CachedPages>();

  read(criteria: TrackCriteria): CachedPages | undefined {
    return this.pages.get(keyOf(criteria));
  }

  write(criteria: TrackCriteria, pages: CachedPages): void {
    this.pages.set(keyOf(criteria), pages);
  }

  invalidate(criteria: TrackCriteria): void {
    this.pages.delete(keyOf(criteria));
  }

  clear(): void {
    this.pages.clear();
  }
}

function keyOf(criteria: TrackCriteria): string {
  return [
    criteria.order,
    criteria.genre?.value ?? '',
    criteria.search ?? '',
    criteria.artistId ?? '',
  ].join('|');
}
