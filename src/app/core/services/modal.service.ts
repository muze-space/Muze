import { computed, Injectable, signal } from '@angular/core';
import { Track } from '../models/track.model';

export type ModalState =
  | { kind: 'login'; redirectTo?: string }
  | { kind: 'createPlaylist'; trackToAdd?: Track }
  | { kind: 'renamePlaylist'; playlistId: string }
  | { kind: 'deletePlaylist'; playlistId: string };

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _activeModal = signal<ModalState | null>(null);
  readonly activeModal = this._activeModal.asReadonly();
  readonly isLoginOpen = computed(() => this._activeModal()?.kind === 'login');
  readonly loginRedirect = computed(() => {
    const modal = this._activeModal();

    return modal?.kind === 'login' ? (modal.redirectTo ?? null) : null;
  });

  openLogin(redirectTo?: string): void {
    this._activeModal.set({ kind: 'login', redirectTo });
  }

  openCreatePlaylist(trackToAdd?: Track): void {
    this._activeModal.set({ kind: 'createPlaylist', trackToAdd });
  }

  openRenamePlaylist(playlistId: string): void {
    this._activeModal.set({ kind: 'renamePlaylist', playlistId });
  }

  openDeletePlaylist(playlistId: string): void {
    this._activeModal.set({ kind: 'deletePlaylist', playlistId });
  }

  close(): void {
    this._activeModal.set(null);
  }

  closeLogin(): void {
    this.close();
  }
}
