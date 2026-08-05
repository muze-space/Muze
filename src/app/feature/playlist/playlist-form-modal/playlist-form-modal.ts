import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from '../../../shared/components/modal/modal';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';
import { noWhitespaceValidator } from '../../../shared/utils/no-whitespace.validator';
import { ModalService } from '../../../core/services/modal.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  PLAYLIST_DESCRIPTION_MAX_LENGTH,
  PLAYLIST_NAME_MAX_LENGTH,
  PlaylistService,
} from '../../../core/services/playlist.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

/** Handles both the "create playlist" and "rename playlist" dialogs. */
@Component({
  selector: 'app-playlist-form-modal',
  imports: [Modal, ReactiveFormsModule, AutofocusDirective],
  templateUrl: './playlist-form-modal.html',
  styleUrl: './playlist-form-modal.css',
})
export class PlaylistFormModal {
  protected readonly nameMaxLength = PLAYLIST_NAME_MAX_LENGTH;
  protected readonly descriptionMaxLength = PLAYLIST_DESCRIPTION_MAX_LENGTH;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private readonly playlistService = inject(PlaylistService);
  private readonly toastService = inject(ToastService);

  private readonly modal = computed(() => this.modalService.activeModal());

  protected readonly isRename = computed(() => this.modal()?.kind === 'renamePlaylist');
  protected readonly title = computed(() => (this.isRename() ? 'Edit playlist' : 'New playlist'));
  protected readonly submitLabel = computed(() => (this.isRename() ? 'Save' : 'Create'));

  protected readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(PLAYLIST_NAME_MAX_LENGTH), noWhitespaceValidator],
    ],
    description: ['', [Validators.maxLength(PLAYLIST_DESCRIPTION_MAX_LENGTH)]],
  });

  constructor() {
    const modal = this.modal();

    if (modal?.kind === 'renamePlaylist') {
      const playlist = this.playlistService.getById(modal.playlistId);

      if (playlist) {
        this.form.setValue({ name: playlist.name, description: playlist.description });
      }
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, description } = this.form.getRawValue();
    const modal = this.modal();

    if (modal?.kind === 'renamePlaylist') {
      this.playlistService.update(modal.playlistId, { name, description });
      this.toastService.show('Playlist updated');
    } else {
      const playlist = this.playlistService.create(name, description);
      const trackToAdd = modal?.kind === 'createPlaylist' ? modal.trackToAdd : undefined;

      if (trackToAdd) {
        this.playlistService.addTrack(playlist.id, trackToAdd);
        this.toastService.show(`Added to ${playlist.name}`);
      } else {
        this.toastService.show(`Created ${playlist.name}`);
        this.router.navigate(['/' + AppRoutes.Playlist, playlist.id]);
      }
    }

    this.modalService.close();
  }

  protected onClose(): void {
    this.modalService.close();
  }
}
