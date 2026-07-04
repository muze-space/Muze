import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { PlayerService } from '../../../core/services/player.service';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [DurationPipe],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css',
})
export class AudioPlayer {
  private readonly playerService = inject(PlayerService);
  readonly currentTrack = this.playerService.currentTrack;
  readonly isPlaying = this.playerService.isPlaying;
  readonly currentTime = this.playerService.currentTime;
  readonly duration = this.playerService.duration;
  readonly volume = this.playerService.volume;
  private readonly audioRef = viewChild<ElementRef<HTMLAudioElement>>('audioElement');

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

  onTimeUpdate(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    this.playerService.setCurrentTime(audio.currentTime);
  }

  onLoadedMetadata(event: Event): void {
    const audio = event.target as HTMLAudioElement;
    this.playerService.setDuration(audio.duration);
  }

  onEnded(): void {
    this.playerService.next();
  }

  onSeek(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const audio = this.audioRef()?.nativeElement;

    if (audio) {
      audio.currentTime = value;
    }

    this.playerService.setCurrentTime(value);
  }

  onVolumeChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.playerService.setVolume(value);
  }
}
