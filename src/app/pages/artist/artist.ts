import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { catchError, EMPTY, filter, forkJoin, map, switchMap, tap } from 'rxjs';
import { ArtistService } from '../../core/services/artist.service';
import { Artist } from '../../core/models/artist.model';
import { Track } from '../../core/models/track.model';
import { ArtistAlbum } from '../../core/models/artist-albums-response.model';
import { Tracks } from '../../shared/components/tracks/tracks';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { PlayCollection } from '../../shared/components/play-collection/play-collection';
import { FollowedArtistsService } from '../../core/services/followed-artists.service';
import { CoverPipe } from '../../shared/pipes/cover.pipe';

@Component({
  selector: 'app-artist',
  imports: [Tracks, DatePipe, RouterLink, PlayCollection, CoverPipe],
  templateUrl: './artist.html',
  styleUrl: './artist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistPage {
  protected readonly AppRoutes = AppRoutes;
  protected readonly trackOrder = TrackOrder;
  protected readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly artistService = inject(ArtistService);

  protected readonly artistId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
  );

  protected readonly artist = signal<Artist | undefined>(undefined);
  protected readonly albums = signal<ArtistAlbum[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly artistTracks = signal<Track[]>([]);

  private readonly followedArtists = inject(FollowedArtistsService);
  protected readonly isFollowed = computed(() => {
    const id = this.artist()?.id;
    return !!id && this.followedArtists.isFollowed(id);
  });

  protected onTracksLoaded(tracks: Track[]): void {
    this.artistTracks.set(tracks);
  }

  protected onToggleFollow(artist: Artist): void {
    this.followedArtists.toggle(artist);
  }

  constructor() {
    toObservable(this.artistId)
      .pipe(
        filter((id): id is string => !!id),
        tap(() => {
          this.isLoading.set(true);
          this.error.set(null);
        }),
        switchMap((id) =>
          forkJoin({
            artist: this.artistService.getArtist(id),
            albums: this.artistService.getArtistAlbums(id),
          }).pipe(
            catchError((err) => {
              this.error.set(err);
              this.isLoading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(({ artist, albums }) => {
        this.artist.set(artist);
        this.albums.set(albums);
        this.isLoading.set(false);
      });
  }
}
