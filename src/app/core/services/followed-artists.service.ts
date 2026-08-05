import { inject, Injectable, signal } from '@angular/core';
import { Artist } from '../models/artist.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class FollowedArtistsService {
  private readonly storage = inject(StorageService);
  private readonly _artists = signal<Artist[]>(
    this.storage.read<Artist[]>(STORAGE_KEYS.followedArtists, []),
  );
  readonly artists = this._artists.asReadonly();

  isFollowed(artistId: string): boolean {
    return this._artists().some((artist) => artist.id === artistId);
  }

  toggle(artist: Artist): void {
    if (this.isFollowed(artist.id)) {
      this.unfollow(artist.id);
    } else {
      this.follow(artist);
    }
  }

  follow(artist: Artist): void {
    if (this.isFollowed(artist.id)) {
      return;
    }

    this._artists.update((artists) => [artist, ...artists]);
    this.persist();
  }

  unfollow(artistId: string): void {
    this._artists.update((artists) => artists.filter((artist) => artist.id !== artistId));
    this.persist();
  }

  private persist(): void {
    this.storage.write(STORAGE_KEYS.followedArtists, this._artists());
  }
}
