import { TestBed } from '@angular/core/testing';
import { PersistedCollection } from './persisted-collection';
import { StorageService } from './storage.service';

const KEY = 'test-collection';

describe('PersistedCollection', () => {
  let storage: StorageService;

  function create(options?: { limit?: number }): PersistedCollection<string> {
    return new PersistedCollection<string>(storage, KEY, options);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
  });

  it('starts empty when storage holds nothing', () => {
    expect(create().items()).toEqual([]);
  });

  it('reads what a previous session wrote', () => {
    create().set(['a', 'b']);

    expect(create().items()).toEqual(['a', 'b']);
  });

  it('update() derives the next value from the current one', () => {
    const collection = create();
    collection.set(['a']);

    collection.update((items) => [...items, 'b']);

    expect(collection.items()).toEqual(['a', 'b']);
    expect(create().items()).toEqual(['a', 'b']);
  });

  it('applies the limit when writing', () => {
    const collection = create({ limit: 2 });

    collection.set(['a', 'b', 'c']);

    expect(collection.items()).toEqual(['a', 'b']);
  });

  it('applies the limit to what it reads back', () => {
    create().set(['a', 'b', 'c']);

    expect(create({ limit: 2 }).items()).toEqual(['a', 'b']);
  });

  it('clear() empties the collection and drops the stored key', () => {
    const collection = create();
    collection.set(['a']);

    collection.clear();

    expect(collection.items()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
