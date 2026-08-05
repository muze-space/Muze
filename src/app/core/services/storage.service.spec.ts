import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('returns the fallback when the key is missing', () => {
    expect(service.read('missing', ['default'])).toEqual(['default']);
  });

  it('round-trips a value through localStorage', () => {
    service.write('key', { a: 1, b: ['x'] });
    expect(service.read('key', null)).toEqual({ a: 1, b: ['x'] });
  });

  it('returns the fallback when the stored value is malformed JSON', () => {
    localStorage.setItem('key', '{not json');
    expect(service.read('key', 'fallback')).toBe('fallback');
  });

  it('distinguishes a stored null from a missing key', () => {
    service.write('key', null);
    expect(service.read('key', 'fallback')).toBeNull();
  });

  it('remove() deletes the key', () => {
    service.write('key', 1);
    service.remove('key');
    expect(service.read('key', 'gone')).toBe('gone');
  });

  it('does not throw when localStorage rejects the write', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    expect(() => service.write('key', 'value')).not.toThrow();

    setItem.mockRestore();
  });
});
