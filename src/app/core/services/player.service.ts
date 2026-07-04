import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);

  play(track: Track): void {
    this.currentTrack.set(track);
    this.isPlaying.set(true);
  }

  pause(): void {
    this.isPlaying.set(false);
  }

  toggle(track: Track): void {
    const isSameTrack = this.currentTrack()?.id === track.id;

    if (isSameTrack && this.isPlaying()) {
      this.pause();
    } else {
      this.play(track);
    }
  }
}
