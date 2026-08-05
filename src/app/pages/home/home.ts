import { TRACK_GENRES } from '../../core/constants/genre.const';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Tracks } from '../../shared/components/tracks/tracks';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { Router } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { GenreItem } from '../../shared/components/genre-item/genre-item';
import { TrackCardRow } from '../../shared/components/track-card-row/track-card-row';
import { PlayHistoryService } from '../../core/services/play-history.service';

@Component({
  selector: 'app-home',
  imports: [Tracks, GenreItem, TrackCardRow],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly trackOrder = TrackOrder;
  readonly genres = TRACK_GENRES;
  readonly recentlyPlayed = inject(PlayHistoryService).history;
  private router = inject(Router);

  onGenreClick(value: string) {
    this.router.navigate([AppRoutes.Search], {
      queryParams: { genre: value },
    });
  }
}
