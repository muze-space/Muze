import { inject, Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';
import { PersistedCollection } from './persisted-collection';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

const HISTORY_LIMIT = 20;

@Injectable({ providedIn: 'root' })
export class PlayHistoryService {
  private readonly collection = new PersistedCollection<Track>(
    inject(StorageService),
    STORAGE_KEYS.playHistory,
    { limit: HISTORY_LIMIT },
  );
  readonly history = this.collection.items;

  add(track: Track): void {
    if (this.history()[0]?.id === track.id) {
      return;
    }

    this.collection.update((tracks) => [track, ...tracks.filter((item) => item.id !== track.id)]);
  }

  clear(): void {
    this.collection.clear();
  }
}
