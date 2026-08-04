import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

export type RepeatMode = 'off' | 'all' | 'one';

const REPEAT_MODES: RepeatMode[] = ['off', 'all', 'one'];

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly queue = signal<Track[]>([]);
  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);
  readonly volume = signal<number>(1);
  readonly shuffle = signal<boolean>(false);
  readonly repeatMode = signal<RepeatMode>('off');
  private shuffledOrder: Track[] = [];

  play(track: Track, queue?: Track[]): void {
    const isDifferentTrack = this.currentTrack()?.id !== track.id;

    this.currentTrack.set(track);
    this.isPlaying.set(true);

    if (isDifferentTrack) {
      this.currentTime.set(0);
      this.duration.set(0);
    }

    if (queue) {
      this.queue.set(queue);
      if (this.shuffle()) {
        this.regenerateShuffledOrder();
      }
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

  toggleShuffle(): void {
    const next = !this.shuffle();
    this.shuffle.set(next);

    if (next) {
      this.regenerateShuffledOrder();
    }
  }

  cycleRepeatMode(): void {
    const currentIndex = REPEAT_MODES.indexOf(this.repeatMode());
    this.repeatMode.set(REPEAT_MODES[(currentIndex + 1) % REPEAT_MODES.length]);
  }

  next(): void {
    this.skip(1);
  }

  previous(): void {
    this.skip(-1);
  }

  /**
   * Called when the current track finishes playing, honoring shuffle/repeat state.
   * Repeat-one is handled by the audio player directly (it needs to seek the <audio> element),
   * so this only needs to cover advancing/stopping the queue.
   */
  onTrackEnded(): void {
    if (this.repeatMode() === 'off' && this.isLastInPlayOrder()) {
      this.pause();
      return;
    }

    this.next();
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

  private isLastInPlayOrder(): boolean {
    const order = this.playOrder();
    const current = this.currentTrack();

    if (!order.length || !current) {
      return true;
    }

    const currentIndex = order.findIndex((track) => track.id === current.id);
    return currentIndex === -1 || currentIndex === order.length - 1;
  }

  private playOrder(): Track[] {
    return this.shuffle() ? this.shuffledOrder : this.queue();
  }

  private regenerateShuffledOrder(): void {
    const order = [...this.queue()];

    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    this.shuffledOrder = order;
  }

  private skip(offset: number): void {
    const order = this.playOrder();
    const current = this.currentTrack();

    if (!order.length || !current) {
      return;
    }

    const currentIndex = order.findIndex((track) => track.id === current.id);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + offset + order.length) % order.length;
    this.play(order[nextIndex]);
  }
}
