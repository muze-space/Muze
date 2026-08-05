import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { CoverPipe } from '../../pipes/cover.pipe';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { RepeatMode } from '../../../core/enums/repeat-mode.enum';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-now-playing',
  imports: [DurationPipe, CoverPipe, RouterLink, Icon],
  templateUrl: './now-playing.html',
  styleUrl: './now-playing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlaying {
  protected readonly AppRoutes = AppRoutes;
  protected readonly RepeatMode = RepeatMode;

  private readonly playerService = inject(PlayerService);
  protected readonly isOpen = this.playerService.isNowPlayingOpen;
  protected readonly track = this.playerService.currentTrack;
  protected readonly isPlaying = this.playerService.isPlaying;
  protected readonly currentTime = this.playerService.currentTime;
  protected readonly duration = this.playerService.duration;
  protected readonly repeatMode = this.playerService.repeatMode;
  protected readonly isRepeatOne = this.playerService.isRepeatOne;
  protected readonly isShuffled = this.playerService.isShuffled;

  protected onClose(): void {
    this.playerService.closeNowPlaying();
  }

  protected onTogglePlay(): void {
    this.playerService.togglePlayback();
  }

  protected onPrevious(): void {
    this.playerService.previous();
  }

  protected onNext(): void {
    this.playerService.next();
  }

  protected onToggleShuffle(): void {
    this.playerService.toggleShuffle();
  }

  protected onCycleRepeat(): void {
    this.playerService.cycleRepeat();
  }

  protected onSeek(event: Event): void {
    this.playerService.seekTo(Number((event.target as HTMLInputElement).value));
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.onClose();
    }
  }
}
