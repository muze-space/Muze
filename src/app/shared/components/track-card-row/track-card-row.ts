import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { PlayerService } from '../../../core/services/player.service';
import { CoverPipe } from '../../pipes/cover.pipe';

/** Horizontal shelf of cover cards — the Spotify "Jump back in" layout. */
@Component({
  selector: 'app-track-card-row',
  imports: [CoverPipe],
  templateUrl: './track-card-row.html',
  styleUrl: './track-card-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCardRow {
  readonly tracks = input.required<Track[]>();

  private readonly playerService = inject(PlayerService);
  protected readonly currentTrack = this.playerService.currentTrack;
  protected readonly isPlaying = this.playerService.isPlaying;

  protected onPlay(track: Track): void {
    this.playerService.toggle(track, this.tracks());
  }
}
