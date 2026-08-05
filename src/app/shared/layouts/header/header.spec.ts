import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Header } from './header';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideHttpClient()],
    });
    fixture = TestBed.createComponent(Header);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  function authButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.login-link');
  }

  function signIn(): void {
    auth.login();
    fixture.detectChanges();
  }

  it('offers login while logged out', () => {
    expect(authButton().textContent?.trim()).toBe('Login');
  });

  it('opens the login modal on click', () => {
    authButton().click();

    expect(TestBed.inject(ModalService).isLoginOpen()).toBe(true);
  });

  it('offers logout once authenticated', () => {
    signIn();

    expect(authButton().textContent?.trim()).toBe('Logout');
  });

  it('logs out on click', () => {
    signIn();

    authButton().click();

    expect(auth.isAuthenticated()).toBe(false);
  });

  it('leaves the library when logging out from it', () => {
    signIn();
    vi.spyOn(router, 'url', 'get').mockReturnValue('/library');
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    authButton().click();

    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('leaves an open playlist when logging out from it', () => {
    signIn();
    vi.spyOn(router, 'url', 'get').mockReturnValue('/playlist/abc');
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    authButton().click();

    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('stays put when logging out from another page', () => {
    signIn();
    vi.spyOn(router, 'url', 'get').mockReturnValue('/search');
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    authButton().click();

    expect(navigate).not.toHaveBeenCalled();
  });
});
