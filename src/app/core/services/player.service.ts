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
}
