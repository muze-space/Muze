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
      this.playerService.playRequestId();
      const audio = this.audioRef()?.nativeElement;

      if (!track || !audio) {
        return;
      }

      audio.src = track.audio;
      audio.load();
      audio.play().catch((err) => console.error('Playback failed:', err));
    });
  }
}
