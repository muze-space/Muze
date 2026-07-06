import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import { API_CONFIG_TOKEN } from '../../core/tokens/api-config.token';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {
          provide: API_CONFIG_TOKEN,
          useValue: { baseUrl: 'https://api.jamendo.com/v3.0/', clientId: 'test' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render home page content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  it('should render without throwing errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });
});
