import { Component, inject, OnInit, signal } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';
import { TracksService } from '../../../core/services/tracks.service';

@Component({
  selector: 'app-popular-tracks',
  imports: [TrackItem],
  templateUrl: './popular-tracks.html',
  styleUrl: './popular-tracks.css',
})
export class PopularTracks implements OnInit {
  private readonly trackService = inject(TracksService);

  tracks = signal<Track[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.isLoading.set(true);

    this.trackService.getPopularTracks().subscribe((response) => {
      this.tracks.set(response.results);
      this.isLoading.set(false);
    });
  }
}
