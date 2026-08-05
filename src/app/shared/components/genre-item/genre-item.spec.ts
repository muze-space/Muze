import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenreItem } from './genre-item';

describe('GenreItem', () => {
  let fixture: ComponentFixture<GenreItem>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [GenreItem] });
    fixture = TestBed.createComponent(GenreItem);
    fixture.componentRef.setInput('genreLabel', 'Rock');
    fixture.detectChanges();
  });

  it('renders the label it is given', () => {
    expect(fixture.nativeElement.querySelector('li').textContent.trim()).toBe('Rock');
  });

  it('follows the label when it changes', () => {
    fixture.componentRef.setInput('genreLabel', 'Jazz');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('li').textContent.trim()).toBe('Jazz');
  });
});
