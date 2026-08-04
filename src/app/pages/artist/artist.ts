import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { finalize, forkJoin, map } from 'rxjs';
import { ArtistService } from '../../core/services/artist.service';
import { Artist } from '../../core/models/artist.model';
import { ArtistAlbum } from '../../core/models/artist-albums-response.model';
import { Track } from '../../core/models/track.model';
import { TrackItem } from '../../shared/components/track-item/track-item';

@Component({
  selector: 'app-artist',
  imports: [TrackItem, DatePipe],
  templateUrl: './artist.html',
  styleUrl: './artist.css',
})
export class ArtistPage {
  private readonly route = inject(ActivatedRoute);
  private readonly artistService = inject(ArtistService);

  private readonly artistId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
  );

  protected readonly artist = signal<Artist | undefined>(undefined);
  protected readonly tracks = signal<Track[]>([]);
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
        tracks: this.artistService.getArtistTracks(id),
        albums: this.artistService.getArtistAlbums(id),
      })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: ({ artist, tracks, albums }) => {
            this.artist.set(artist);
            this.tracks.set(tracks);
            this.albums.set(albums);
          },
          error: (err) => this.error.set(err),
        });
    });
  }
}
