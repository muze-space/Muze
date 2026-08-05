import { computed, inject, Injectable, signal } from '@angular/core';
import { Playlist } from '../models/playlist.model';
import { Track } from '../models/track.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

export const PLAYLIST_NAME_MAX_LENGTH = 60;
export const PLAYLIST_DESCRIPTION_MAX_LENGTH = 200;

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private readonly storage = inject(StorageService);
  private readonly _playlists = signal<Playlist[]>(
    this.storage.read<Playlist[]>(STORAGE_KEYS.playlists, []),
  );
  readonly playlists = this._playlists.asReadonly();
  readonly count = computed(() => this._playlists().length);

  getById(id: string): Playlist | undefined {
    return this._playlists().find((playlist) => playlist.id === id);
  }

  create(name: string, description = ''): Playlist {
    const playlist: Playlist = {
      id: this.createId(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      tracks: [],
    };

    // Newest first, matching how the sidebar lists them.
    this._playlists.update((playlists) => [playlist, ...playlists]);
    this.persist();

    return playlist;
  }

  update(id: string, changes: { name?: string; description?: string }): void {
    this._playlists.update((playlists) =>
      playlists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              name: changes.name?.trim() ?? playlist.name,
              description: changes.description?.trim() ?? playlist.description,
            }
          : playlist,
      ),
    );
    this.persist();
  }

  remove(id: string): void {
    this._playlists.update((playlists) => playlists.filter((playlist) => playlist.id !== id));
    this.persist();
  }

  /** Returns false when the playlist is unknown or already contains the track. */
  addTrack(id: string, track: Track): boolean {
    const playlist = this.getById(id);

    if (!playlist || playlist.tracks.some((existing) => existing.id === track.id)) {
      return false;
    }

    this.replaceTracks(id, [...playlist.tracks, track]);

    return true;
  }

  removeTrack(id: string, trackId: string): void {
    const playlist = this.getById(id);

    if (!playlist) {
      return;
    }

    this.replaceTracks(
      id,
      playlist.tracks.filter((track) => track.id !== trackId),
    );
  }

  reorder(id: string, from: number, to: number): void {
    const playlist = this.getById(id);

    if (!playlist) {
      return;
    }

    const tracks = [...playlist.tracks];
    const isOutOfRange =
      from < 0 || to < 0 || from >= tracks.length || to >= tracks.length || from === to;

    if (isOutOfRange) {
      return;
    }

    const [moved] = tracks.splice(from, 1);
    tracks.splice(to, 0, moved);

    this.replaceTracks(id, tracks);
  }

  containsTrack(id: string, trackId: string): boolean {
    return !!this.getById(id)?.tracks.some((track) => track.id === trackId);
  }

  private replaceTracks(id: string, tracks: Track[]): void {
    this._playlists.update((playlists) =>
      playlists.map((playlist) => (playlist.id === id ? { ...playlist, tracks } : playlist)),
    );
    this.persist();
  }

  private createId(): string {
    // crypto.randomUUID needs a secure context; GitHub Pages qualifies, but a
    // plain-http dev host would not.
    return crypto.randomUUID?.() ?? `pl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private persist(): void {
    this.storage.write(STORAGE_KEYS.playlists, this._playlists());
  }
}
