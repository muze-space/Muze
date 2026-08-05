import { computed, Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';
import { RepeatMode } from '../enums/repeat-mode.enum';

const REPEAT_CYCLE: readonly RepeatMode[] = [RepeatMode.Off, RepeatMode.All, RepeatMode.One];

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly _queue = signal<Track[]>([]);
  readonly queue = this._queue.asReadonly();

  private readonly _currentIndex = signal<number>(-1);
  readonly currentIndex = this._currentIndex.asReadonly();
  readonly currentTrack = computed<Track | null>(
    () => this._queue()[this._currentIndex()] ?? null,
  );
  readonly upNext = computed(() => this._queue().slice(this._currentIndex() + 1));

  readonly isPlaying = signal<boolean>(false);
  readonly currentTime = signal<number>(0);
  readonly seekToken = signal<number>(0);
  readonly duration = signal<number>(0);
  readonly volume = signal<number>(1);

  readonly repeatMode = signal<RepeatMode>(RepeatMode.Off);
  readonly isRepeatOne = computed(() => this.repeatMode() === RepeatMode.One);
  readonly isShuffled = signal<boolean>(false);
  readonly isQueueOpen = signal<boolean>(false);
  readonly isNowPlayingOpen = signal<boolean>(false);

  private originalQueue: Track[] = [];

  play(track: Track, queue?: Track[]): void {
    if (queue) {
      this.replaceQueue(queue, track);
    } else {
      const index = this._queue().findIndex((queued) => queued.id === track.id);

      if (index === -1) {
        this.replaceQueue([track], track);
      } else {
        this.applyPosition(this._queue(), index);
      }
    }

    this.isPlaying.set(true);
  }

  playShuffled(tracks: Track[]): void {
    if (!tracks.length) {
      return;
    }

    const startIndex = Math.floor(Math.random() * tracks.length);
    const rest = this.shuffle(tracks.filter((_, position) => position !== startIndex));

    this.isShuffled.set(true);
    this.originalQueue = [...tracks];

    // The picked track leads the queue, so everything else stays ahead of it
    // instead of only the tail that happened to follow its original position.
    this.applyPosition([tracks[startIndex], ...rest], 0);
    this.isPlaying.set(true);
  }

  playAt(index: number): void {
    if (index < 0 || index >= this._queue().length) {
      return;
    }

    this.applyPosition(this._queue(), index);
    this.isPlaying.set(true);
  }

  pause(): void {
    this.isPlaying.set(false);
  }

  resume(): void {
    if (this.currentTrack()) {
      this.isPlaying.set(true);
    }
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

  trackEnded(): void {
    this.skip(1);
  }

  cycleRepeat(): void {
    const nextIndex = (REPEAT_CYCLE.indexOf(this.repeatMode()) + 1) % REPEAT_CYCLE.length;
    this.repeatMode.set(REPEAT_CYCLE[nextIndex]);
  }

  toggleShuffle(): void {
    if (this.isShuffled()) {
      this.isShuffled.set(false);

      const current = this.currentTrack();
      const restored = [...this.originalQueue];
      const index = current ? restored.findIndex((track) => track.id === current.id) : -1;

      this.applyPosition(restored, index);
      return;
    }

    this.isShuffled.set(true);
    this.originalQueue = [...this._queue()];

    const index = this._currentIndex();
    this.applyPosition(this.shuffleKeepingCurrent(this._queue(), index), index);
  }

  addToQueue(track: Track): void {
    this.originalQueue = [...this.originalQueue, track];
    this._queue.update((queue) => [...queue, track]);
  }

  playNext(track: Track): void {
    const insertAt = this._currentIndex() + 1;

    const original = [...this.originalQueue];
    original.splice(Math.min(insertAt, original.length), 0, track);
    this.originalQueue = original;

    this._queue.update((queue) => {
      const next = [...queue];
      next.splice(insertAt, 0, track);
      return next;
    });
  }

  removeFromQueue(index: number): void {
    const queue = this._queue();

    if (index < 0 || index >= queue.length) {
      return;
    }

    const removed = queue[index];
    const next = queue.filter((_, position) => position !== index);
    this.originalQueue = this.originalQueue.filter((track) => track !== removed);

    let currentIndex = this._currentIndex();

    if (index < currentIndex) {
      currentIndex -= 1;
    }

    if (!next.length) {
      currentIndex = -1;
      this.isPlaying.set(false);
    } else if (currentIndex >= next.length) {
      currentIndex = next.length - 1;
    }

    this.applyPosition(next, currentIndex);
  }

  moveInQueue(from: number, to: number): void {
    const queue = this._queue();
    const isOutOfRange =
      from < 0 || to < 0 || from >= queue.length || to >= queue.length || from === to;

    if (isOutOfRange) {
      return;
    }

    const next = [...queue];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    const current = this.currentTrack();

    this._queue.set(next);
    this._currentIndex.set(current ? next.indexOf(current) : -1);
  }

  loadQueue(queue: Track[], index: number, originalQueue = queue): void {
    this.originalQueue = [...originalQueue];
    this._queue.set([...queue]);
    this._currentIndex.set(index >= 0 && index < queue.length ? index : -1);
    this.isPlaying.set(false);
  }

  getOriginalQueue(): Track[] {
    return this.originalQueue;
  }

  clearQueue(): void {
    this.originalQueue = [];
    this.isPlaying.set(false);
    this.applyPosition([], -1);
  }

  toggleQueuePanel(): void {
    this.isQueueOpen.update((isOpen) => !isOpen);
  }

  openNowPlaying(): void {
    this.isNowPlayingOpen.set(true);
  }

  closeNowPlaying(): void {
    this.isNowPlayingOpen.set(false);
  }

  setCurrentTime(time: number): void {
    this.currentTime.set(time);
  }

  seekTo(time: number): void {
    this.currentTime.set(time);
    this.seekToken.update((token) => token + 1);
  }

  setDuration(duration: number): void {
    this.duration.set(duration);
  }

  setVolume(volume: number): void {
    this.volume.set(volume);
  }

  private replaceQueue(queue: Track[], startTrack: Track): void {
    let next = [...queue];
    let index = next.findIndex((track) => track.id === startTrack.id);

    if (index === -1) {
      next = [startTrack, ...next];
      index = 0;
    }

    this.originalQueue = next;

    if (this.isShuffled()) {
      next = this.shuffleKeepingCurrent(next, index);
    }

    this.applyPosition(next, index);
  }

  private applyPosition(queue: Track[], index: number): void {
    const previousId = this.currentTrack()?.id;

    this._queue.set(queue);
    this._currentIndex.set(index);

    if (queue[index]?.id !== previousId) {
      this.currentTime.set(0);
      this.duration.set(0);
    }
  }

  private shuffle(tracks: Track[]): Track[] {
    const shuffled = [...tracks];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  private shuffleKeepingCurrent(queue: Track[], index: number): Track[] {
    const rest = this.shuffle(queue.filter((_, position) => position !== index));

    if (index < 0 || index >= queue.length) {
      return rest;
    }

    rest.splice(index, 0, queue[index]);
    return rest;
  }

  private skip(offset: number): void {
    const queue = this._queue();
    const index = this._currentIndex();

    if (!queue.length || index === -1) {
      return;
    }

    const target = index + offset;

    if (target >= 0 && target < queue.length) {
      this.applyPosition(queue, target);
      return;
    }

    if (this.repeatMode() === RepeatMode.Off) {
      if (target >= queue.length) {
        this.isPlaying.set(false);
      }
      return;
    }

    this.applyPosition(queue, (target + queue.length) % queue.length);
  }
}
