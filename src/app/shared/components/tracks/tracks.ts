import { Component, effect, inject, input, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';
import { TracksService } from '../../../core/services/tracks.service';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { TrackGenre } from '../../../core/constants/genre.const';

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
  tracks = signal<Track[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  private readonly trackService = inject(TracksService);

  constructor() {
    effect(() => {
      const order = this.order();
      const genre = this.genre();
      const search = this.search();

      this.isLoading.set(true);
      this.error.set(null);

      this.trackService
        .getTracks({ order, genre, search })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            this.tracks.set(response.results);
          },
          error: (err) => {
            this.error.set(err);
          },
        });
    });
  }
}
