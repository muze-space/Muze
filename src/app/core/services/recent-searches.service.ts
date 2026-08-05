import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { PersistedCollection } from './persisted-collection';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

const SEARCH_LIMIT = 8;

@Injectable({ providedIn: 'root' })
export class RecentSearchesService {
  private readonly collection = new PersistedCollection<string>(
    inject(StorageService),
    STORAGE_KEYS.recentSearches,
    { limit: SEARCH_LIMIT },
  );
  readonly queries = this.collection.items;

  add(query: string): void {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    const lower = trimmed.toLowerCase();

    this.collection.update((queries) => [
      trimmed,
      ...queries.filter((item) => item.toLowerCase() !== lower),
    ]);
  }

  remove(query: string): void {
    this.collection.update((queries) => queries.filter((item) => item !== query));
  }

  clear(): void {
    this.collection.clear();
  }
}
