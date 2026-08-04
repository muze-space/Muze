import { Component, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs';
import { TracksService } from '../../../core/services/tracks.service';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { QUERY_PARAMS } from '../../../core/constants/query-params.const';

@Component({
  selector: 'app-search',
  imports: [TrackItem, ClickOutsideDirective, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  suggestions = signal<Track[]>([]);
  isResultsWindowOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  searchForm = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
  });

  private _tracksService = inject(TracksService);
  private _router = inject(Router);

  constructor() {
    this.searchForm.controls.query.valueChanges
      .pipe(
        map((value) => value.trim()),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((query) => {
        if (query) {
          this.isLoading.set(true);
          this.error.set(null);

          this._tracksService
            .getTracks({ search: query, order: TrackOrder.Relevance })
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
              next: (response) => {
                this.suggestions.set(response.results);
                this.isResultsWindowOpen.set(true);
              },
              error: (err) => {
                this.error.set(err);
                this.isResultsWindowOpen.set(false);
              },
            });
        } else {
          this.suggestions.set([]);
          this.isResultsWindowOpen.set(false);
          this.isLoading.set(false);
          this.error.set(null);
        }
      });
  }

  closeResults(): void {
    this.isResultsWindowOpen.set(false);
  }

  submitSearch(): void {
    const query = this.searchForm.controls.query.value.trim();

    if (!query) {
      return;
    }

    this.closeResults();
    this._router.navigate([AppRoutes.Search], { queryParams: { [QUERY_PARAMS.query]: query } });
  }
}
