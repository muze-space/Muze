import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Sidebar } from './sidebar';
import { AuthService } from '../../../core/services/auth.service';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(4);
  });

  it('hides the playlists section while logged out', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sidebar__playlists')).toBeFalsy();
  });

  it('shows the playlists section once authenticated', () => {
    TestBed.inject(AuthService).login();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sidebar__playlists')).toBeTruthy();
  });
});
