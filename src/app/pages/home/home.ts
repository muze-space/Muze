import { Component } from '@angular/core';
import { PopularTracks } from "../../shared/components/popular-tracks/popular-tracks";
import { Footer } from "../../shared/layouts/footer/footer";
import { Header } from "../../shared/layouts/header/header";

@Component({
  selector: 'app-home',
  imports: [Header, Footer, PopularTracks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  popular_tracks_limit = 10;
  search = '';

  onSearchChange(value: string): void {
    this.search = value;
  }
}
