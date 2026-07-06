import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { GenreItem } from './genre-item';

@Component({
  selector: 'app-test-genre-host',
  template: `<app-genre-item [genreLabel]="'Rock'"></app-genre-item>`,
  imports: [GenreItem],
})
class TestGenreHostComponent {}

describe('GenreItem', () => {
  let component: GenreItem;
  let fixture: ComponentFixture<TestGenreHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGenreHostComponent, GenreItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TestGenreHostComponent);
    component = fixture.debugElement.query((el) => el.name === 'app-genre-item').componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render genre item', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  it('should be a list item', () => {
    fixture.detectChanges();
    const liElement = fixture.nativeElement.querySelector('li');
    expect(liElement).toBeTruthy();
  });
});
