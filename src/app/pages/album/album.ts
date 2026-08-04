import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { finalize, map } from 'rxjs';
import { TracksService } from '../../core/services/tracks.service';
import { TrackOrder } from '../../core/enums/track-order.enum';
import { Track } from '../../core/models/track.model';
import { TrackItem } from '../../shared/components/track-item/track-item';
import { AppRoutes } from '../../core/enums/app-routes.enum';

const ALBUM_TRACKS_LIMIT = 50;

@Component({
  selector: 'app-album',
  imports: [TrackItem, DatePipe, RouterLink],
  templateUrl: './album.html',
  styleUrl: './album.css',
})
export class AlbumPage {
  protected readonly AppRoutes = AppRoutes;
  private readonly route = inject(ActivatedRoute);
  private readonly tracksService = inject(TracksService);

  private readonly albumId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
  );

  protected readonly tracks = signal<Track[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly album = computed(() => this.tracks()[0]);

  constructor() {
    effect(() => {
      const id = this.albumId();

      if (!id) {
        return;
      }

      this.isLoading.set(true);
      this.error.set(null);

      this.tracksService
        .getTracks({ albumId: id, order: TrackOrder.Id, limit: ALBUM_TRACKS_LIMIT })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => this.tracks.set(response.results),
          error: (err) => this.error.set(err),
        });
    });
  }
}
