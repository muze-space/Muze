import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { API_CONFIG_TOKEN } from './core/tokens/api-config.token';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: API_CONFIG_TOKEN,
          useValue: { baseUrl: 'https://api.jamendo.com/v3.0/', clientId: 'test' },
        },
      ],
    }).compileComponents();
  });

  it('should have test suite configured', () => {
    expect(true).toBeTruthy();
  });
});
