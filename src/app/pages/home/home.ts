import { TRACK_GENRES } from '../../core/constants/genre.const';
import { Component, inject } from '@angular/core';
import { Tracks } from '../../shared/components/tracks/tracks';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { Router } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { GenreItem } from '../../shared/components/genre-item/genre-item';

@Component({
  selector: 'app-home',
  imports: [Tracks, GenreItem],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);

  readonly trackOrder = TrackOrder;
  readonly genres = TRACK_GENRES;

  onGenreClick(value: string) {
    this.router.navigate([AppRoutes.Search], {
      queryParams: { genre: value },
    });
  }
}
