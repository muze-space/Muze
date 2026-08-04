import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { LikedTracksService } from '../../core/services/liked-tracks.service';
import { TrackItem } from '../../shared/components/track-item/track-item';

@Component({
  selector: 'app-library',
  imports: [RouterLink, TrackItem],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library {
  protected readonly AppRoutes = AppRoutes;
  private readonly likedTracksService = inject(LikedTracksService);
  readonly likedTracks = this.likedTracksService.likedTracks;
}
