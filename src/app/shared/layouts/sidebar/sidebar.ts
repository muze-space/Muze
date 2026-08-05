import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ModalService } from '../../../core/services/modal.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly AppRoutes = AppRoutes;
  protected readonly playlists = inject(PlaylistService).playlists;
  private readonly modalService = inject(ModalService);
  protected readonly isAuthenticated = inject(AuthService).isAuthenticated;

  protected onCreatePlaylist(): void {
    this.modalService.openCreatePlaylist();
  }
}
