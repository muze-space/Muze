import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
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
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
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
        this.isLoading.set(true);
        this.error.set(null);
        this.trackService
          .getTracks({ genre: genre })
          .pipe(finalize(() => this.isLoading.set(false)))
          .subscribe({
            next: (response) => this.tracks.set(response.results),
            error: (err) => this.error.set(err),
          });
      } else {
        this.tracks.set([]);
        this.error.set(null);
      }
    });
  }
}
