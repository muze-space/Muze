import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { TrackItem } from '../../shared/components/track-item/track-item';
import { PlayCollection } from '../../shared/components/play-collection/play-collection';
import { CoverPipe } from '../../shared/pipes/cover.pipe';
import { PlaylistService } from '../../core/services/playlist.service';
import { ModalService } from '../../core/services/modal.service';
import { AppRoutes } from '../../core/enums/app-routes.enum';
import { Track } from '../../core/models/track.model';

const COVER_TILES = 4;

@Component({
  selector: 'app-playlist',
  imports: [TrackItem, RouterLink, PlayCollection, CoverPipe],
  templateUrl: './playlist.html',
  styleUrl: './playlist.css',
})
export class PlaylistPage {
  protected readonly AppRoutes = AppRoutes;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playlistService = inject(PlaylistService);
  private readonly modalService = inject(ModalService);

  private readonly playlistId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  protected readonly playlist = computed(() => {
    // Reading the signal keeps the page live through renames and track edits.
    const playlists = this.playlistService.playlists();
    return playlists.find((item) => item.id === this.playlistId());
  });

  protected readonly tracks = computed(() => this.playlist()?.tracks ?? []);

  /** Up to four album covers, tiled like a Spotify playlist thumbnail. */
  protected readonly coverImages = computed(() => {
    const images = this.tracks()
      .map((track) => track.album_image)
      .filter((image): image is string => !!image);

    return [...new Set(images)].slice(0, COVER_TILES);
  });

  /** Index being dragged; null when no drag is in progress. */
  protected readonly draggedIndex = signal<number | null>(null);

  protected readonly totalDuration = computed(() => {
    const seconds = this.tracks().reduce((sum, track) => sum + track.duration, 0);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);

    return hours ? `${hours} hr ${minutes} min` : `${minutes} min`;
  });

  constructor() {
    effect(() => {
      // The id can be stale after a deletion or come from a hand-typed URL.
      if (this.playlistId() && !this.playlist()) {
        this.router.navigate(['/' + AppRoutes.NotFound]);
      }
    });
  }

  protected onEdit(): void {
    this.modalService.openRenamePlaylist(this.playlistId());
  }

  protected onDelete(): void {
    this.modalService.openDeletePlaylist(this.playlistId());
  }

  protected onRemoveTrack(track: Track): void {
    this.playlistService.removeTrack(this.playlistId(), track.id);
  }

  protected onDragStart(index: number): void {
    this.draggedIndex.set(index);
  }

  protected onDragOver(event: DragEvent): void {
    // Without this the browser refuses the drop.
    event.preventDefault();
  }

  protected onDrop(index: number): void {
    const from = this.draggedIndex();

    if (from !== null) {
      this.playlistService.reorder(this.playlistId(), from, index);
    }

    this.draggedIndex.set(null);
  }

  protected onDragEnd(): void {
    this.draggedIndex.set(null);
  }
}
