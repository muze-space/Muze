import { Component, ElementRef, inject, viewChild } from '@angular/core';
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
}
