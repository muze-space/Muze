import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { ModalService } from '../services/modal.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

function runGuard(url = '/library'): boolean | UrlTree {
  return TestBed.runInInjectionContext(
    () =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot) as boolean | UrlTree,
  );
}

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('allows access when the demo login flag is set', () => {
    localStorage.setItem(STORAGE_KEYS.isAuthenticated, 'true');

    expect(runGuard()).toBe(true);
  });

  it('cancels the navigation and opens the login modal, leaving the page as is', async () => {
    await TestBed.inject(Router).navigateByUrl('/');

    expect(runGuard()).toBe(false);
    expect(TestBed.inject(ModalService).isLoginOpen()).toBe(true);
  });

  it('remembers the blocked url so the login can return to it', async () => {
    await TestBed.inject(Router).navigateByUrl('/');

    runGuard('/library?tab=artists');

    expect(TestBed.inject(ModalService).loginRedirect()).toBe('/library?tab=artists');
  });

  it('falls back to home when the app opens straight on a guarded url', () => {
    const result = runGuard();

    expect(result).toEqual(TestBed.inject(Router).parseUrl('/'));
    expect(TestBed.inject(ModalService).isLoginOpen()).toBe(true);
  });
});
