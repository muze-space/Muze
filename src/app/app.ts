import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/layouts/footer/footer';
import { Header } from './shared/layouts/header/header';
import { AudioPlayer } from './shared/components/audio-player/audio-player';
import { Login } from './feature/auth/login/login';
import { ModalService } from './core/services/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AudioPlayer, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('muze');
  protected readonly modalService = inject(ModalService);
  search = '';

  onSearchChange(value: string): void {
    this.search = value;
  }
}
