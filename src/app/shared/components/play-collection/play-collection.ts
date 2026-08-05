import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { PlayerService } from '../../../core/services/player.service';
import { Icon } from '../icon/icon';

/** "Play" / "Shuffle" pair shown in the header of any track collection. */
@Component({
  selector: 'app-play-collection',
  imports: [Icon],
  templateUrl: './play-collection.html',
  styleUrl: './play-collection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayCollection {
  readonly tracks = input.required<Track[]>();

  private readonly playerService = inject(PlayerService);
  protected readonly isDisabled = computed(() => !this.tracks().length);

  protected onPlay(): void {
    const tracks = this.tracks();

    if (tracks.length) {
      this.playerService.play(tracks[0], tracks);
    }
  }

  protected onShuffle(): void {
    this.playerService.playShuffled(this.tracks());
  }
}
