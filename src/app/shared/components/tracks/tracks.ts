import { Component, inject, input, OnInit, signal } from '@angular/core';
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
export class Tracks implements OnInit {
  order = input.required<TrackOrder>();
  genre = input<TrackGenre>();
  tracks = signal<Track[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  private readonly trackService = inject(TracksService);

  ngOnInit() {
    this.isLoading.set(true);
    this.error.set(null);

    this.trackService
      .getTracks({ order: this.order(), genre: this.genre() })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.tracks.set(response.results);
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }
}
