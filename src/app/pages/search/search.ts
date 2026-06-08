import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '../../core/models/track.model';
import { TracksService } from '../../core/services/tracks.service';
import { TRACK_GENRES } from '../../core/constants/genre.const';
import { QUERY_PARAMS } from '../../core/constants/query-params.const';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  tracks = signal<Track[]>([]);
  tracksCount = computed(() => this.tracks().length);
  private route = inject(ActivatedRoute);
  private trackService = inject(TracksService);

  constructor() {
    effect(() => {
      const count = this.tracksCount();
      console.log(`Search results count: ${count}`);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const genre = TRACK_GENRES.find((g) => g.value === params[QUERY_PARAMS.genre]);

      if (params[QUERY_PARAMS.genre]) {
        this.trackService
          .getTracks({ genre: genre })
          .subscribe((response) => this.tracks.set(response.results));
      }
    });
  }
}
