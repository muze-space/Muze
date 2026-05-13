import { Component } from '@angular/core';
import { PopularTracks } from "../../components/popular-tracks/popular-tracks";
import { NewReleases } from "../../components/new-releases/new-releases";

@Component({
  selector: 'app-discover',
  imports: [PopularTracks, NewReleases],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {}
