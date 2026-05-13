import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreTags } from './genre-tags';

describe('GenreTags', () => {
  let component: GenreTags;
  let fixture: ComponentFixture<GenreTags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreTags],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreTags);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
