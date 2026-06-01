import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/layouts/footer/footer';
import { Header } from './shared/layouts/header/header';
import { AudioPlayer } from './shared/components/audio-player/audio-player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AudioPlayer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('muze');
  search = '';

  onSearchChange(value: string): void {
    this.search = value;
  }
}
