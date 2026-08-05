import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { PlayerService } from '../../../core/services/player.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { CoverPipe } from '../../pipes/cover.pipe';
import { RepeatMode } from '../../../core/enums/repeat-mode.enum';
import { QueuePanel } from '../queue-panel/queue-panel';
import { NowPlaying } from '../now-playing/now-playing';
import { resizeCover } from '../../utils/cover-url';
import { Icon, IconName } from '../icon/icon';

const VOLUME_STEP = 0.1;
const MEDIA_SESSION_ARTWORK_SIZE = 500;

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [DurationPipe, CoverPipe, QueuePanel, NowPlaying, Icon],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css',
})
export class AudioPlayer {
  protected readonly RepeatMode = RepeatMode;
  private readonly playerService = inject(PlayerService);
  readonly currentTrack = this.playerService.currentTrack;
  readonly isPlaying = this.playerService.isPlaying;
  readonly currentTime = this.playerService.currentTime;
  readonly duration = this.playerService.duration;
  readonly volume = this.playerService.volume;
  readonly repeatMode = this.playerService.repeatMode;
  readonly isRepeatOne = this.playerService.isRepeatOne;
  readonly isShuffled = this.playerService.isShuffled;
  readonly isQueueOpen = this.playerService.isQueueOpen;
  private readonly audioRef = viewChild<ElementRef<HTMLAudioElement>>('audioElement');

  /** Level to come back to when unmuting. */
  private volumeBeforeMute = 1;

  /** Speaker icon reflects the level, so mute is readable at a glance. */
  readonly volumeIcon = computed<IconName>(() => {
    const volume = this.volume();

    if (volume === 0) {
      return 'volume-mute';
    }

    return volume < 0.5 ? 'volume-low' : 'volume-high';
  });

  constructor() {
    effect(() => {
      const track = this.currentTrack();
      const isPlaying = this.isPlaying();
      const audio = this.audioRef()?.nativeElement;

      if (!track || !audio) {
        return;
      }

      if (audio.dataset['trackId'] !== track.id) {
        audio.src = track.audio;
        audio.dataset['trackId'] = track.id;
        audio.load();
      }

      if (isPlaying) {
        audio.play().catch((err) => console.error('Playback failed:', err));
      } else {
        audio.pause();
      }
    });

    effect(() => {
      const audio = this.audioRef()?.nativeElement;

      if (audio) {
        audio.volume = this.volume();
      }
    });

    // Seeks come from the seek bar and the Now Playing view.
    effect(() => {
      this.playerService.seekToken();

      const audio = this.audioRef()?.nativeElement;
      const time = untracked(this.currentTime);

      if (audio && audio.readyState > 0) {
        audio.currentTime = time;
      }
    });

    // Puts the track on the OS media controls and wires up hardware media keys.
    effect(() => {
      const track = this.currentTrack();

      if (!this.hasMediaSession() || !track) {
        return;
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        // The OS renders this large — a list thumbnail would be a blurry mess.
        artwork: track.album_image
          ? [{ src: resizeCover(track.album_image, MEDIA_SESSION_ARTWORK_SIZE), sizes: '512x512' }]
          : [],
      });
    });

    effect(() => {
      if (this.hasMediaSession()) {
        navigator.mediaSession.playbackState = this.isPlaying() ? 'playing' : 'paused';
      }
    });

    afterNextRender(() => this.registerMediaSessionHandlers());
  }

  private hasMediaSession(): boolean {
    return typeof navigator !== 'undefined' && 'mediaSession' in navigator;
  }

  private registerMediaSessionHandlers(): void {
    if (!this.hasMediaSession()) {
      return;
    }

    navigator.mediaSession.setActionHandler('play', () => this.playerService.resume());
    navigator.mediaSession.setActionHandler('pause', () => this.playerService.pause());
    navigator.mediaSession.setActionHandler('previoustrack', () => this.playerService.previous());
    navigator.mediaSession.setActionHandler('nexttrack', () => this.playerService.next());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        this.playerService.seekTo(details.seekTime);
      }
    });
  }

  onTogglePlay(): void {
    this.playerService.togglePlayback();
  }

  onPrevious(): void {
    this.playerService.previous();
  }

  onNext(): void {
    this.playerService.next();
  }

  onToggleShuffle(): void {
    this.playerService.toggleShuffle();
  }

  onCycleRepeat(): void {
    this.playerService.cycleRepeat();
  }

  onToggleQueue(): void {
    this.playerService.toggleQueuePanel();
  }

  onOpenNowPlaying(): void {
    this.playerService.openNowPlaying();
  }

  onTimeUpdate(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    this.playerService.setCurrentTime(audio.currentTime);
  }

  onLoadedMetadata(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    this.playerService.setDuration(audio.duration);

    // A restored session knows the position but the element has only just loaded.
    const resumeAt = this.currentTime();

    if (resumeAt > 0 && audio.currentTime === 0) {
      audio.currentTime = Math.min(resumeAt, audio.duration || resumeAt);
    }
  }

  onEnded(): void {
    this.playerService.trackEnded();
  }

  onSeek(event: Event): void {
    this.playerService.seekTo(Number((event.target as HTMLInputElement).value));
  }

  onVolumeChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    if (value > 0) {
      this.volumeBeforeMute = value;
    }

    this.playerService.setVolume(value);
  }

  onToggleMute(): void {
    if (this.volume() > 0) {
      this.volumeBeforeMute = this.volume();
      this.playerService.setVolume(0);
    } else {
      this.playerService.setVolume(this.volumeBeforeMute);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

    if (isTyping) {
      return;
    }

    switch (event.code) {
      case 'Space':
        if (!this.currentTrack()) {
          return;
        }
        event.preventDefault();
        this.onTogglePlay();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.playerService.setVolume(Math.min(1, this.volume() + VOLUME_STEP));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.playerService.setVolume(Math.max(0, this.volume() - VOLUME_STEP));
        break;
      case 'KeyM':
        event.preventDefault();
        this.onToggleMute();
        break;
    }
  }
}
