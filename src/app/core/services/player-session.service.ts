import { DestroyRef, effect, inject, Injectable, untracked } from '@angular/core';
import { PlayerService } from './player.service';
import { PlayHistoryService } from './play-history.service';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';
import { Track } from '../models/track.model';
import { RepeatMode } from '../enums/repeat-mode.enum';

/** Longest queue worth persisting — localStorage is small and shared. */
const MAX_PERSISTED_QUEUE = 100;
/** `timeupdate` fires ~4x a second, far too often to write through. */
const TIME_SAVE_INTERVAL_MS = 5000;

interface PersistedPlayerState {
  queue: Track[];
  originalQueue: Track[];
  currentIndex: number;
  currentTime: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
}

/**
 * Keeps the player alive across reloads and feeds the play history. Lives apart
 * from PlayerService so that service stays a plain state container.
 *
 * Instantiate it once from the app shell — nothing else references it.
 */
@Injectable({ providedIn: 'root' })
export class PlayerSessionService {
  private readonly player = inject(PlayerService);
  private readonly history = inject(PlayHistoryService);
  private readonly storage = inject(StorageService);

  constructor() {
    this.restore();

    // Recording here rather than in play() also catches next/previous and the queue panel.
    effect(() => {
      const track = this.player.currentTrack();

      if (track) {
        untracked(() => this.history.add(track));
      }
    });

    // Anything but playback position is cheap enough to write on every change.
    effect(() => {
      this.player.queue();
      this.player.currentIndex();
      this.player.volume();
      this.player.repeatMode();
      this.player.isShuffled();

      untracked(() => this.persist());
    });

    const timer = setInterval(() => {
      if (this.player.isPlaying()) {
        this.persist();
      }
    }, TIME_SAVE_INTERVAL_MS);

    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  private restore(): void {
    const state = this.storage.read<PersistedPlayerState | null>(STORAGE_KEYS.playerState, null);

    if (!state?.queue?.length) {
      return;
    }

    this.player.loadQueue(state.queue, state.currentIndex, state.originalQueue ?? state.queue);
    this.player.setCurrentTime(state.currentTime ?? 0);
    this.player.setVolume(state.volume ?? 1);
    this.player.repeatMode.set(state.repeatMode ?? RepeatMode.Off);
    this.player.isShuffled.set(state.isShuffled ?? false);
  }

  private persist(): void {
    const queue = this.player.queue();

    if (!queue.length) {
      this.storage.remove(STORAGE_KEYS.playerState);
      return;
    }

    // Window the queue around the current track so a deep position survives the cap.
    const index = this.player.currentIndex();
    const start = Math.max(0, Math.min(index, queue.length - MAX_PERSISTED_QUEUE));

    const state: PersistedPlayerState = {
      queue: queue.slice(start, start + MAX_PERSISTED_QUEUE),
      originalQueue: this.player.getOriginalQueue().slice(0, MAX_PERSISTED_QUEUE),
      currentIndex: index - start,
      currentTime: this.player.currentTime(),
      volume: this.player.volume(),
      repeatMode: this.player.repeatMode(),
      isShuffled: this.player.isShuffled(),
    };

    this.storage.write(STORAGE_KEYS.playerState, state);
  }
}
