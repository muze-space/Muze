import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { TRACK_GENRES } from '../../core/constants/genre.const';
import { QUERY_PARAMS } from '../../core/constants/query-params.const';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { Tracks } from '../../shared/components/tracks/tracks';

@Component({
  selector: 'app-search',
  imports: [Tracks],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  protected readonly trackOrder = TrackOrder;
  private readonly route = inject(ActivatedRoute);

  protected readonly query = toSignal(
    this.route.queryParams.pipe(map((params) => params[QUERY_PARAMS.query] as string | undefined)),
  );

  protected readonly genre = toSignal(
    this.route.queryParams.pipe(
      map((params) => TRACK_GENRES.find((g) => g.value === params[QUERY_PARAMS.genre])),
    ),
  );

  protected readonly hasCriteria = computed(() => !!this.query() || !!this.genre());
}
