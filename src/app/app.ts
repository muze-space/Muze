import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/layouts/footer/footer';
import { Header } from './shared/layouts/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
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
