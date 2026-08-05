import { inject, Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

const HISTORY_LIMIT = 20;

@Injectable({ providedIn: 'root' })
export class PlayHistoryService {
  private readonly storage = inject(StorageService);
  private readonly _history = signal<Track[]>(
    this.storage.read<Track[]>(STORAGE_KEYS.playHistory, []).slice(0, HISTORY_LIMIT),
  );
  readonly history = this._history.asReadonly();

  add(track: Track): void {
    const current = this._history();

    if (current[0]?.id === track.id) {
      return;
    }

    const next = [track, ...current.filter((item) => item.id !== track.id)].slice(0, HISTORY_LIMIT);

    this._history.set(next);
    this.storage.write(STORAGE_KEYS.playHistory, next);
  }

  clear(): void {
    this._history.set([]);
    this.storage.remove(STORAGE_KEYS.playHistory);
  }
}
