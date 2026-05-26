import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularTracks } from './popular-tracks';

describe('PopularTracks', () => {
  let component: PopularTracks;
  let fixture: ComponentFixture<PopularTracks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularTracks],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularTracks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
