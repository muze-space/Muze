import { Component, HostListener, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { QUERY_PARAMS } from '../../../core/constants/query-params.const';
import { RecentSearchesService } from '../../../core/services/recent-searches.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchForm = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
  });

  protected readonly isHistoryOpen = signal(false);

  private _router = inject(Router);
  private readonly recentSearchesService = inject(RecentSearchesService);
  protected readonly recentSearches = this.recentSearchesService.queries;

  constructor() {
    this.searchForm.controls.query.valueChanges
      .pipe(
        map((value) => value.trim()),
        debounceTime(1000),
        distinctUntilChanged(),
        filter((query) => !!query),
        takeUntilDestroyed(),
      )
      .subscribe((query) => this.navigateToSearch(query));
  }

  submitSearch(): void {
    const query = this.searchForm.controls.query.value.trim();

    if (!query) {
      return;
    }

    this.navigateToSearch(query);
  }

  protected onFocus(): void {
    // Only shown for an empty field; otherwise it would cover what's being typed.
    if (!this.searchForm.controls.query.value.trim()) {
      this.isHistoryOpen.set(true);
    }
  }

  protected onPickRecent(query: string): void {
    this.searchForm.controls.query.setValue(query, { emitEvent: false });
    this.navigateToSearch(query);
  }

  protected onRemoveRecent(query: string): void {
    this.recentSearchesService.remove(query);
  }

  protected onClearRecent(): void {
    this.recentSearchesService.clear();
    this.isHistoryOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.search-section')) {
      this.isHistoryOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.isHistoryOpen.set(false);
  }

  private navigateToSearch(query: string): void {
    this.recentSearchesService.add(query);
    this.isHistoryOpen.set(false);
    this._router.navigate([AppRoutes.Search], { queryParams: { [QUERY_PARAMS.query]: query } });
  }
}
