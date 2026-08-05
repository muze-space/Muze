import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

const SEARCH_LIMIT = 8;

@Injectable({ providedIn: 'root' })
export class RecentSearchesService {
  private readonly storage = inject(StorageService);
  private readonly _queries = signal<string[]>(
    this.storage.read<string[]>(STORAGE_KEYS.recentSearches, []).slice(0, SEARCH_LIMIT),
  );
  readonly queries = this._queries.asReadonly();

  add(query: string): void {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    const lower = trimmed.toLowerCase();
    const next = [trimmed, ...this._queries().filter((item) => item.toLowerCase() !== lower)].slice(
      0,
      SEARCH_LIMIT,
    );

    this._queries.set(next);
    this.storage.write(STORAGE_KEYS.recentSearches, next);
  }

  remove(query: string): void {
    const next = this._queries().filter((item) => item !== query);

    this._queries.set(next);
    this.storage.write(STORAGE_KEYS.recentSearches, next);
  }

  clear(): void {
    this._queries.set([]);
    this.storage.remove(STORAGE_KEYS.recentSearches);
  }
}
