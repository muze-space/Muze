import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockInstance } from 'vitest';
import { provideRouter, Router } from '@angular/router';
import { SearchComponent } from './search.component';
import { RecentSearchesService } from '../../../core/services/recent-searches.service';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;
  let router: Router;
  let recent: RecentSearchesService;
  let navigate: MockInstance<Router['navigate']>;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    recent = TestBed.inject(RecentSearchesService);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function type(value: string): void {
    component.searchForm.controls.query.setValue(value);
  }

  it('waits for a pause before searching for what was typed', () => {
    type('bea');
    vi.advanceTimersByTime(900);

    expect(navigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(navigate).toHaveBeenCalledWith(['search'], {
      queryParams: { query: 'bea' },
      replaceUrl: true,
    });
  });

  it('replaces the url while typing so back does not walk through every keystroke', () => {
    type('b');
    vi.advanceTimersByTime(1000);
    type('be');
    vi.advanceTimersByTime(1000);

    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate.mock.calls.every((call) => call[1]?.replaceUrl)).toBe(true);
  });

  it('does not remember half-typed queries', () => {
    type('bea');
    vi.advanceTimersByTime(1000);

    expect(recent.queries()).toEqual([]);
  });

  it('submitting keeps a history entry and remembers the query', () => {
    type('beatles');

    component.submitSearch();

    expect(navigate).toHaveBeenCalledWith(['search'], {
      queryParams: { query: 'beatles' },
      replaceUrl: false,
    });
    expect(recent.queries()).toEqual(['beatles']);
  });

  it('ignores a blank submit', () => {
    type('   ');

    component.submitSearch();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('picking a recent search runs it without re-triggering the typing stream', () => {
    recent.add('daft punk');

    component['onPickRecent']('daft punk');
    vi.advanceTimersByTime(1000);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(['search'], {
      queryParams: { query: 'daft punk' },
      replaceUrl: false,
    });
  });

  it('opens the recent searches on focus and closes them on escape', () => {
    component['onFocus']();

    expect(component['isHistoryOpen']()).toBe(true);

    component['onEscape']();

    expect(component['isHistoryOpen']()).toBe(false);
  });
});
