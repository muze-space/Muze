import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Track } from '../../../core/models/track.model';
import { PlaylistService } from '../../../core/services/playlist.service';
import { PlayerService } from '../../../core/services/player.service';
import { LikedTracksService } from '../../../core/services/liked-tracks.service';
import { ModalService } from '../../../core/services/modal.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { AuthService } from '../../../core/services/auth.service';

type MenuView = 'root' | 'playlists';

const MENU_HEIGHT_ESTIMATE = 260;

@Component({
  selector: 'app-track-menu',
  imports: [],
  templateUrl: './track-menu.html',
  styleUrl: './track-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMenu {
  readonly track = input.required<Track>();
  readonly removable = input<boolean>(false);
  readonly removeRequested = output<Track>();

  protected readonly isOpen = signal(false);
  protected readonly view = signal<MenuView>('root');
  protected readonly opensDownward = signal(false);
  protected readonly playlists = inject(PlaylistService).playlists;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly playlistService = inject(PlaylistService);
  private readonly playerService = inject(PlayerService);
  private readonly likedTracksService = inject(LikedTracksService);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  protected readonly isLiked = computed(
    () => this.authService.isAuthenticated() && this.likedTracksService.isLiked(this.track().id),
  );

  protected onToggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }

    const { bottom } = (this.host.nativeElement as HTMLElement).getBoundingClientRect();
    this.opensDownward.set(window.innerHeight - bottom > MENU_HEIGHT_ESTIMATE);
    this.view.set('root');
    this.isOpen.set(true);
  }

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.onToggle();
  }

  protected onShowPlaylists(): void {
    if (!this.requireAccount()) {
      return;
    }

    this.view.set('playlists');
  }

  protected onBack(): void {
    this.view.set('root');
  }

  protected containsTrack(playlistId: string): boolean {
    return this.playlistService.containsTrack(playlistId, this.track().id);
  }

  protected onAddToPlaylist(playlistId: string, playlistName: string): void {
    const added = this.playlistService.addTrack(playlistId, this.track());

    this.toastService.show(added ? `Added to ${playlistName}` : `Already in ${playlistName}`);
    this.close();
  }

  protected onNewPlaylist(): void {
    this.modalService.openCreatePlaylist(this.track());
    this.close();
  }

  protected onAddToQueue(): void {
    this.playerService.addToQueue(this.track());
    this.toastService.show('Added to queue');
    this.close();
  }

  protected onPlayNext(): void {
    this.playerService.playNext(this.track());
    this.toastService.show('Playing next');
    this.close();
  }

  protected onToggleLike(): void {
    if (!this.requireAccount()) {
      return;
    }

    this.likedTracksService.toggle(this.track());
    this.close();
  }

  protected onGoToArtist(): void {
    this.router.navigate(['/' + AppRoutes.Artist, this.track().artist_id]);
    this.close();
  }

  protected onGoToAlbum(): void {
    this.router.navigate(['/' + AppRoutes.Album, this.track().album_id]);
    this.close();
  }

  protected onRemove(): void {
    this.removeRequested.emit(this.track());
    this.close();
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected onHostInteraction(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click')
  protected onDocumentClick(): void {
    this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }

  private requireAccount(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.close();
    this.modalService.openLogin();

    return false;
  }

  private close(): void {
    this.isOpen.set(false);
    this.view.set('root');
  }
}
