import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

function createService(): AuthService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(AuthService);
}

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts logged out', () => {
    expect(createService().isAuthenticated()).toBe(false);
  });

  it('persists the login so a reload stays authenticated', () => {
    createService().login();

    expect(createService().isAuthenticated()).toBe(true);
  });

  it('clears the stored flag on logout', () => {
    const service = createService();
    service.login();

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.isAuthenticated)).toBeNull();
    expect(createService().isAuthenticated()).toBe(false);
  });

  it('reads the flag written by the previous string-based login', () => {
    localStorage.setItem(STORAGE_KEYS.isAuthenticated, 'true');

    expect(createService().isAuthenticated()).toBe(true);
  });
});
