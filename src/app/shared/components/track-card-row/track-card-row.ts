import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Track } from '../../../core/models/track.model';
import { PlayerService } from '../../../core/services/player.service';
import { CoverPipe } from '../../pipes/cover.pipe';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-track-card-row',
  imports: [CoverPipe, RouterLink, Icon],
  templateUrl: './track-card-row.html',
  styleUrl: './track-card-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCardRow {
  readonly tracks = input.required<Track[]>();

  protected readonly AppRoutes = AppRoutes;
  private readonly playerService = inject(PlayerService);
  protected readonly currentTrack = this.playerService.currentTrack;
  protected readonly isPlaying = this.playerService.isPlaying;

  protected onPlay(track: Track): void {
    this.playerService.toggle(track, this.tracks());
  }
}
