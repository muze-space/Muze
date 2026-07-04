import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css',
})
export class AudioPlayer {
  private readonly playerService = inject(PlayerService);
  readonly currentTrack = this.playerService.currentTrack;
  private readonly audioRef = viewChild<ElementRef<HTMLAudioElement>>('audioElement');
  constructor() {
    effect(() => {
      const track = this.currentTrack();
      const isPlaying = this.playerService.isPlaying();
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
  }
}
