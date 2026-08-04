import { Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

const STORAGE_KEY = 'likedTracks';

@Injectable({ providedIn: 'root' })
export class LikedTracksService {
  private readonly _likedTracks = signal<Track[]>(this.readFromStorage());
  readonly likedTracks = this._likedTracks.asReadonly();

  isLiked(trackId: string): boolean {
    return this._likedTracks().some((track) => track.id === trackId);
  }

  toggle(track: Track): void {
    if (this.isLiked(track.id)) {
      this.unlike(track.id);
    } else {
      this.like(track);
    }
  }

  like(track: Track): void {
    if (this.isLiked(track.id)) {
      return;
    }

    this._likedTracks.update((tracks) => [...tracks, track]);
    this.writeToStorage();
  }

  unlike(trackId: string): void {
    this._likedTracks.update((tracks) => tracks.filter((track) => track.id !== trackId));
    this.writeToStorage();
  }

  private readFromStorage(): Track[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private writeToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._likedTracks()));
  }
}
