import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from '../../../shared/components/modal/modal';
import { ModalService } from '../../../core/services/modal.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

@Component({
  selector: 'app-delete-playlist-modal',
  imports: [Modal],
  templateUrl: './delete-playlist-modal.html',
  styleUrl: './delete-playlist-modal.css',
})
export class DeletePlaylistModal {
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly playlistService = inject(PlaylistService);
  private readonly toastService = inject(ToastService);

  private readonly playlistId = computed(() => {
    const modal = this.modalService.activeModal();
    return modal?.kind === 'deletePlaylist' ? modal.playlistId : null;
  });

  protected readonly playlistName = computed(() => {
    const id = this.playlistId();
    return (id && this.playlistService.getById(id)?.name) || 'this playlist';
  });

  protected onConfirm(): void {
    const id = this.playlistId();

    if (!id) {
      return;
    }

    const name = this.playlistName();
    const wasOpen = this.router.url.includes(`/${AppRoutes.Playlist}/${id}`);

    this.playlistService.remove(id);
    this.modalService.close();
    this.toastService.show(`Deleted ${name}`);

    if (wasOpen) {
      this.router.navigate(['/' + AppRoutes.Library]);
    }
  }

  protected onClose(): void {
    this.modalService.close();
  }
}
