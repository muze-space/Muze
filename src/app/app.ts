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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Footer, AudioPlayer, Login, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('muze');
  protected readonly modalService = inject(ModalService);
  protected readonly playerService = inject(PlayerService);
  search = '';

  onSearchChange(value: string): void {
    this.search = value;
  }
}
