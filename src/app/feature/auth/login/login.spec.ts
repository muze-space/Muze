import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let auth: AuthService;
  let modalService: ModalService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [Login] });
    fixture = TestBed.createComponent(Login);
    auth = TestBed.inject(AuthService);
    modalService = TestBed.inject(ModalService);
    modalService.openLogin();
    fixture.detectChanges();
  });

  it('signs the user in and closes itself', () => {
    fixture.nativeElement.querySelector('.login-btn').click();

    expect(auth.isAuthenticated()).toBe(true);
    expect(modalService.isLoginOpen()).toBe(false);
  });

  it('closes without signing in from the close button', () => {
    fixture.nativeElement.querySelector('.close-btn').click();

    expect(auth.isAuthenticated()).toBe(false);
    expect(modalService.isLoginOpen()).toBe(false);
  });

  it('closes on escape', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));

    expect(modalService.isLoginOpen()).toBe(false);
  });

  it('does not name a provider the app cannot actually use', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Jamendo');
  });
});
