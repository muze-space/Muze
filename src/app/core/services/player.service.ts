import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly queue = signal<Track[]>([]);
  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);
  readonly volume = signal<number>(1);

  play(track: Track, queue?: Track[]): void {
    this.currentTrack.set(track);
    this.isPlaying.set(true);
    this.currentTime.set(0);

    if (queue) {
      this.queue.set(queue);
    }
  }

  pause(): void {
    this.isPlaying.set(false);
  }

  toggle(track: Track, queue?: Track[]): void {
    const isSameTrack = this.currentTrack()?.id === track.id;

    if (isSameTrack && this.isPlaying()) {
      this.pause();
    } else {
      this.play(track, queue);
    }
  }

  togglePlayback(): void {
    if (!this.currentTrack()) {
      return;
    }

    this.isPlaying.update((isPlaying) => !isPlaying);
  }

  next(): void {
    this.skip(1);
  }

  previous(): void {
    this.skip(-1);
  }

  setCurrentTime(time: number): void {
    this.currentTime.set(time);
  }

  setDuration(duration: number): void {
    this.duration.set(duration);
  }

  setVolume(volume: number): void {
    this.volume.set(volume);
  }

  private skip(offset: number): void {
    const queue = this.queue();
    const current = this.currentTrack();

    if (!queue.length || !current) {
      return;
    }

    const currentIndex = queue.findIndex((track) => track.id === current.id);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + offset + queue.length) % queue.length;
    this.play(queue[nextIndex], queue);
  }
}
