import { TestBed } from '@angular/core/testing';
import { RecentSearchesService } from './recent-searches.service';

function createService(): RecentSearchesService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(RecentSearchesService);
}

describe('RecentSearchesService', () => {
  let service: RecentSearchesService;

  beforeEach(() => {
    localStorage.clear();
    service = createService();
  });

  it('starts empty', () => {
    expect(service.queries()).toEqual([]);
  });

  it('add() keeps the newest query first and trims it', () => {
    service.add('  jazz  ');
    service.add('rock');

    expect(service.queries()).toEqual(['rock', 'jazz']);
  });

  it('add() ignores blank queries', () => {
    service.add('   ');

    expect(service.queries()).toEqual([]);
  });

  it('add() dedupes case-insensitively, keeping the latest casing', () => {
    service.add('Jazz');
    service.add('rock');
    service.add('JAZZ');

    expect(service.queries()).toEqual(['JAZZ', 'rock']);
  });

  it('keeps at most 8 queries', () => {
    for (let i = 0; i < 12; i++) {
      service.add(`query ${i}`);
    }

    expect(service.queries().length).toBe(8);
    expect(service.queries()[0]).toBe('query 11');
  });

  it('remove() and clear() drop entries and persist', () => {
    service.add('jazz');
    service.add('rock');

    service.remove('jazz');
    expect(createService().queries()).toEqual(['rock']);

    service.clear();
    expect(createService().queries()).toEqual([]);
  });
});
