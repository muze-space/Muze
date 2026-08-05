import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { API_CONFIG_TOKEN } from './core/tokens/api-config.token';
import { ModalService } from './core/services/modal.service';
import { PlayerService } from './core/services/player.service';

describe('App', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<App>>;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: API_CONFIG_TOKEN,
          useValue: { baseUrl: 'https://api.jamendo.com/v3.0/', clientId: 'test' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('renders the shell with sidebar, header and footer', () => {
    const shell = fixture.nativeElement;

    expect(shell.querySelector('app-sidebar')).toBeTruthy();
    expect(shell.querySelector('app-header')).toBeTruthy();
    expect(shell.querySelector('app-footer')).toBeTruthy();
    expect(shell.querySelector('router-outlet')).toBeTruthy();
  });

  it('keeps the player bar out of the way until a track is playing', () => {
    expect(fixture.nativeElement.querySelector('.player-bar')).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector('.app-shell').classList.contains('app-shell--has-player'),
    ).toBe(false);
  });

  it('opens the modal that the modal service asks for', () => {
    TestBed.inject(ModalService).openLogin();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-login')).toBeTruthy();

    TestBed.inject(ModalService).close();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-login')).toBeFalsy();
  });

  it('exposes the player service state to the shell', () => {
    expect(TestBed.inject(PlayerService).currentTrack()).toBeNull();
  });
});
