import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { LikedTracksService } from '../../core/services/liked-tracks.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { FollowedArtistsService } from '../../core/services/followed-artists.service';
import { ModalService } from '../../core/services/modal.service';
import { TrackItem } from '../../shared/components/track-item/track-item';
import { PlayCollection } from '../../shared/components/play-collection/play-collection';
import { CoverPipe } from '../../shared/pipes/cover.pipe';

const TABS = ['tracks', 'playlists', 'artists'] as const;
type LibraryTab = (typeof TABS)[number];

@Component({
  selector: 'app-library',
  imports: [RouterLink, TrackItem, PlayCollection, CoverPipe],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library {
  protected readonly AppRoutes = AppRoutes;
  protected readonly tabs = TABS;

  private readonly route = inject(ActivatedRoute);
  private readonly likedTracksService = inject(LikedTracksService);
  private readonly modalService = inject(ModalService);

  readonly likedTracks = this.likedTracksService.likedTracks;
  protected readonly playlists = inject(PlaylistService).playlists;
  protected readonly followedArtists = inject(FollowedArtistsService).artists;

  /** Kept in the URL so the active tab survives reloads and the back button. */
  private readonly tabParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('tab'))),
    { initialValue: null },
  );

  protected readonly activeTab = computed<LibraryTab>(() => {
    const tab = this.tabParam();
    return TABS.includes(tab as LibraryTab) ? (tab as LibraryTab) : 'tracks';
  });

  protected onCreatePlaylist(): void {
    this.modalService.openCreatePlaylist();
  }
}
