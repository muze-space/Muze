import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReleases } from './new-releases';

describe('NewReleases', () => {
  let component: NewReleases;
  let fixture: ComponentFixture<NewReleases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReleases],
    }).compileComponents();

    fixture = TestBed.createComponent(NewReleases);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
