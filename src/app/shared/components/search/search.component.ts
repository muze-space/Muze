import { Component, inject, signal } from '@angular/core';
import { debounceTime, finalize, Subject } from 'rxjs';
import { TracksService } from '../../../core/services/tracks.service';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';

@Component({
  selector: 'app-search',
  imports: [TrackItem],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class Search {
  suggestions = signal<Track[]>([]);
  isResultsWindowOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  query = '';

  private _tracksService = inject(TracksService);
  private _searchSubject = new Subject<string>();

  private _subscription = this._searchSubject.pipe(debounceTime(500)).subscribe((searchQuery) => {
    if (searchQuery.trim()) {
      this.isLoading.set(true);
      this.error.set(null);

      this._tracksService
        .getTracks({ search: searchQuery, order: TrackOrder.Relevance })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            this.suggestions.set(response.results);
            this.isResultsWindowOpen.set(true);
            console.log('_subscription: ', this.query);
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

  onInput(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    console.log('onInput: ', this.query);

    this._searchSubject.next(this.query);
  }
}
