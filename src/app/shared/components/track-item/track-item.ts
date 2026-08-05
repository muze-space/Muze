import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Track } from '../../../core/models/track.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { CoverPipe } from '../../pipes/cover.pipe';
import { DatePipe } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { LikedTracksService } from '../../../core/services/liked-tracks.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { TrackMenu } from '../track-menu/track-menu';
import { Icon } from '../icon/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-track-item',
  imports: [DurationPipe, CoverPipe, DatePipe, RouterLink, TrackMenu, Icon],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackItem {
  protected readonly AppRoutes = AppRoutes;
  track = input.required<Track>();
  queue = input<Track[]>([]);
  removable = input<boolean>(false);
  readonly removeRequested = output<Track>();
  private readonly playerService = inject(PlayerService);
  private readonly likedTracksService = inject(LikedTracksService);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  readonly isCurrentTrack = computed(
    () => this.playerService.currentTrack()?.id === this.track().id,
  );
  readonly isPlaying = computed(() => this.isCurrentTrack() && this.playerService.isPlaying());
  readonly isLiked = computed(
    () => this.authService.isAuthenticated() && this.likedTracksService.isLiked(this.track().id),
  );

  onTrackClick() {
    this.playerService.toggle(this.track(), this.queue());
  }

  onLikeClick(event: Event) {
    event.stopPropagation();

    if (!this.authService.isAuthenticated()) {
      this.modalService.openLogin();
      return;
    }

    this.likedTracksService.toggle(this.track());
  }

  onRemoveRequested(track: Track) {
    this.removeRequested.emit(track);
  }
}
