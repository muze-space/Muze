import { Component, inject, input, OnInit, signal } from '@angular/core';
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
  private readonly trackService = inject(TracksService);

  order = input.required<TrackOrder>();
  genre = input<TrackGenre>();

  tracks = signal<Track[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.isLoading.set(true);

    this.trackService.getTracks(this.order(), this.genre()).subscribe((response) => {
      this.tracks.set(response.results);
      this.isLoading.set(false);
    });
  }
}
