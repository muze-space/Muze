import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { PopularTracks } from "../../components/popular-tracks/popular-tracks";
import { Footer } from '../../components/footer/footer';

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
