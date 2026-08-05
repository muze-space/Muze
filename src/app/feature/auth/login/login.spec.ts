import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({ template: '' })
class StubPage {}

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let auth: AuthService;
  let modalService: ModalService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([
          { path: 'library', component: StubPage },
          { path: 'album/:id', component: StubPage },
        ]),
      ],
    });
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

  it('lands on the page the login was asked for', async () => {
    modalService.openLogin('/library?tab=artists');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.login-btn').click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/library?tab=artists');
  });

  it('stays put when the login was not about a guarded page', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/album/1');

    fixture.nativeElement.querySelector('.login-btn').click();
    await fixture.whenStable();

    expect(router.url).toBe('/album/1');
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
