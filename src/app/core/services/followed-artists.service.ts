import { inject, Injectable } from '@angular/core';
import { Artist } from '../models/artist.model';
import { StorageService } from './storage.service';
import { PersistedCollection } from './persisted-collection';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class FollowedArtistsService {
  private readonly collection = new PersistedCollection<Artist>(
    inject(StorageService),
    STORAGE_KEYS.followedArtists,
  );
  readonly artists = this.collection.items;

  isFollowed(artistId: string): boolean {
    return this.artists().some((artist) => artist.id === artistId);
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

    this.collection.update((artists) => [artist, ...artists]);
  }

  unfollow(artistId: string): void {
    this.collection.update((artists) => artists.filter((artist) => artist.id !== artistId));
  }
}
