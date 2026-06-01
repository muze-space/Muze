import { Component, inject, signal } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { TracksService } from '../../../core/services/tracks.service';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';

@Component({
  selector: 'app-search',
  imports: [TrackItem],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private _tracksService = inject(TracksService);
  private _searchSubject = new Subject<string>();
  suggestions = signal<Track[]>([]);
  isResultsWindowOpen = signal<boolean>(false);
  query = '';

  private _subscription = this._searchSubject.pipe(debounceTime(500)).subscribe((searchQuery) => {
    if (searchQuery.trim()) {
      this._tracksService
        .getTracks({ search: searchQuery, order: TrackOrder.Relevance })
        .subscribe((response) => {
          this.suggestions.set(response.results);
          this.isResultsWindowOpen.set(true);
          console.log('_subscription: ', this.query);
        });
    } else {
      this.suggestions.set([]);
      this.isResultsWindowOpen.set(false);
    }
  });

  onInput(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    console.log('onInput: ', this.query);

    this._searchSubject.next(this.query);
  }
}
