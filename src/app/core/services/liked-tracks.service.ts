import { inject, Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';
import { PersistedCollection } from './persisted-collection';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class LikedTracksService {
  private readonly collection = new PersistedCollection<Track>(
    inject(StorageService),
    STORAGE_KEYS.likedTracks,
  );
  readonly likedTracks = this.collection.items;

  isLiked(trackId: string): boolean {
    return this.likedTracks().some((track) => track.id === trackId);
  }

  toggle(track: Track): void {
    if (this.isLiked(track.id)) {
      this.unlike(track.id);
    } else {
      this.like(track);
    }
  }

  like(track: Track): void {
    if (this.isLiked(track.id)) {
      return;
    }

    this.collection.update((tracks) => [...tracks, track]);
  }

  unlike(trackId: string): void {
    this.collection.update((tracks) => tracks.filter((track) => track.id !== trackId));
  }
}
