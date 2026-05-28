import { Component } from '@angular/core';
import { PopularTracks } from '../../shared/components/popular-tracks/popular-tracks';

@Component({
  selector: 'app-home',
  imports: [PopularTracks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
