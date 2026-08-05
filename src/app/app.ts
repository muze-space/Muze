import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/layouts/footer/footer';
import { Header } from './shared/layouts/header/header';
import { Sidebar } from './shared/layouts/sidebar/sidebar';
import { AudioPlayer } from './shared/components/audio-player/audio-player';
import { Login } from './feature/auth/login/login';
import { ModalService } from './core/services/modal.service';
import { Toast } from './shared/components/toast/toast';
import { PlayerService } from './core/services/player.service';
import { PlayerSessionService } from './core/services/player-session.service';
import { PlaylistFormModal } from './feature/playlist/playlist-form-modal/playlist-form-modal';
import { DeletePlaylistModal } from './feature/playlist/delete-playlist-modal/delete-playlist-modal';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
    Footer,
    AudioPlayer,
    Login,
    Toast,
    PlaylistFormModal,
    DeletePlaylistModal,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('muze');
  protected readonly modalService = inject(ModalService);
  protected readonly playerService = inject(PlayerService);
  private readonly playerSession = inject(PlayerSessionService);
  search = '';

  onSearchChange(value: string): void {
    this.search = value;
  }
}
