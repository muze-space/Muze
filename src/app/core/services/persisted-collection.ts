import { signal, Signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface PersistedCollectionOptions {
  limit?: number;
}

export class PersistedCollection<T> {
  private readonly _items;
  readonly items: Signal<T[]>;

  constructor(
    private readonly storage: StorageService,
    private readonly key: string,
    private readonly options: PersistedCollectionOptions = {},
  ) {
    this._items = signal(this.cap(this.storage.read<T[]>(this.key, [])));
    this.items = this._items.asReadonly();
  }

  set(next: T[]): void {
    const capped = this.cap(next);

    this._items.set(capped);
    this.storage.write(this.key, capped);
  }

  update(change: (items: T[]) => T[]): void {
    this.set(change(this._items()));
  }

  clear(): void {
    this._items.set([]);
    this.storage.remove(this.key);
  }

  private cap(items: T[]): T[] {
    return this.options.limit === undefined ? items : items.slice(0, this.options.limit);
  }
}
