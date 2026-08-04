import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { finalize, forkJoin, map } from 'rxjs';
import { ArtistService } from '../../core/services/artist.service';
import { Artist } from '../../core/models/artist.model';
import { ArtistAlbum } from '../../core/models/artist-albums-response.model';
import { Tracks } from '../../shared/components/tracks/tracks';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  selector: 'app-artist',
  imports: [Tracks, DatePipe, RouterLink],
  templateUrl: './artist.html',
  styleUrl: './artist.css',
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

  constructor() {
    effect(() => {
      const id = this.artistId();

      if (!id) {
        return;
      }

      this.isLoading.set(true);
      this.error.set(null);

      forkJoin({
        artist: this.artistService.getArtist(id),
        albums: this.artistService.getArtistAlbums(id),
      })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: ({ artist, albums }) => {
            this.artist.set(artist);
            this.albums.set(albums);
          },
          error: (err) => this.error.set(err),
        });
    });
  }
}
