import { Component, effect, inject, input, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';
import { TracksService } from '../../../core/services/tracks.service';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { TrackGenre } from '../../../core/constants/genre.const';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-tracks',
  imports: [TrackItem],
  templateUrl: './tracks.html',
  styleUrl: './tracks.css',
})
export class Tracks {
  order = input.required<TrackOrder>();
  genre = input<TrackGenre>();
  search = input<string>();
  artistId = input<string>();
  emptyMessage = input<string>('No tracks found.');
  tracks = signal<Track[]>([]);
  isLoading = signal<boolean>(false);
  isLoadingMore = signal<boolean>(false);
  hasMore = signal<boolean>(false);
  error = signal<string | null>(null);
  private readonly trackService = inject(TracksService);
  private offset = 0;

  constructor() {
    effect(() => {
      const order = this.order();
      const genre = this.genre();
      const search = this.search();
      const artistId = this.artistId();

      this.offset = 0;
      this.tracks.set([]);
      this.hasMore.set(false);
      this.isLoading.set(true);
      this.error.set(null);

      this.trackService
        .getTracks({ order, genre, search, artistId, limit: PAGE_SIZE, offset: 0 })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            this.tracks.set(response.results);
            this.offset = response.results.length;
            this.hasMore.set(!!response.headers.next);
          },
          error: (err) => {
            this.error.set(err);
          },
        });
    });
  }

  loadMore(): void {
    if (this.isLoadingMore() || !this.hasMore()) {
      return;
    }

    this.isLoadingMore.set(true);

    this.trackService
      .getTracks({
        order: this.order(),
        genre: this.genre(),
        search: this.search(),
        artistId: this.artistId(),
        limit: PAGE_SIZE,
        offset: this.offset,
      })
      .pipe(finalize(() => this.isLoadingMore.set(false)))
      .subscribe({
        next: (response) => {
          this.tracks.update((tracks) => [...tracks, ...response.results]);
          this.offset += response.results.length;
          this.hasMore.set(!!response.headers.next);
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }
}
