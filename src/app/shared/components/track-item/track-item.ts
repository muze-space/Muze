import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Track } from '../../../core/models/track.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DatePipe } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { LikedTracksService } from '../../../core/services/liked-tracks.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

@Component({
  selector: 'app-track-item',
  imports: [DurationPipe, DatePipe, RouterLink],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  protected readonly AppRoutes = AppRoutes;
  track = input.required<Track>();
  isSearchVersion = input<boolean>(false);
  queue = input<Track[]>([]);
  private readonly playerService = inject(PlayerService);
  private readonly likedTracksService = inject(LikedTracksService);
  readonly isCurrentTrack = computed(
    () => this.playerService.currentTrack()?.id === this.track().id,
  );
  readonly isPlaying = computed(() => this.isCurrentTrack() && this.playerService.isPlaying());
  readonly isLiked = computed(() => this.likedTracksService.isLiked(this.track().id));

  onTrackClick() {
    this.playerService.toggle(this.track(), this.queue());
  }

  onLikeClick(event: Event) {
    event.stopPropagation();
    this.likedTracksService.toggle(this.track());
  }
}
