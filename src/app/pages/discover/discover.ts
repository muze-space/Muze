import { Component } from '@angular/core';
import { PopularTracks } from "../../components/popular-tracks/popular-tracks";

@Component({
  selector: 'app-discover',
  imports: [PopularTracks],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {}
