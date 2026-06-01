import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '../../core/models/track.model';
import { TracksService } from '../../core/services/tracks.service';
import { TRACK_GENRES } from '../../core/constants/genre.const';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { QUERY_PARAMS } from '../../core/constants/search-params.const';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private route = inject(ActivatedRoute);
  private trackService = inject(TracksService);

  tracks = signal<Track[]>([]);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const genre = TRACK_GENRES.find((g) => g.value === params[QUERY_PARAMS.genre]);

      if (params[QUERY_PARAMS.genre]) {
        this.trackService
          .getTracks(TrackOrder.PopularityTotal, genre)
          .subscribe((response) => this.tracks.set(response.results));
      }
    });
  }
}
