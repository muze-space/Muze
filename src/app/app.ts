import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Discover } from "./pages/discover/discover";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Discover],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('muze');
}
