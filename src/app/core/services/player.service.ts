import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly playRequestId = signal(0);

  play(track: Track): void {
    this.currentTrack.set(track);
    this.isPlaying.set(true);
    this.playRequestId.update((id) => id + 1);
  }

  pause(): void {
    this.isPlaying.set(false);
  }
}
