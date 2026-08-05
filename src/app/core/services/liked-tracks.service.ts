import { inject, Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class LikedTracksService {
  private readonly storage = inject(StorageService);
  private readonly _likedTracks = signal<Track[]>(
    this.storage.read<Track[]>(STORAGE_KEYS.likedTracks, []),
  );
  readonly likedTracks = this._likedTracks.asReadonly();

  isLiked(trackId: string): boolean {
    return this._likedTracks().some((track) => track.id === trackId);
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

    this._likedTracks.update((tracks) => [...tracks, track]);
    this.persist();
  }

  unlike(trackId: string): void {
    this._likedTracks.update((tracks) => tracks.filter((track) => track.id !== trackId));
    this.persist();
  }

  private persist(): void {
    this.storage.write(STORAGE_KEYS.likedTracks, this._likedTracks());
  }
}
