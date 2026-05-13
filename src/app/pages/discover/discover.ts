import { Component } from '@angular/core';
import { PopularTracks } from "../../components/popular-tracks/popular-tracks";
import { NewReleases } from "../../components/new-releases/new-releases";
import { GenreTags } from "../../components/genre-tags/genre-tags";

@Component({
  selector: 'app-discover',
  imports: [PopularTracks, NewReleases, GenreTags],
  templateUrl: './discover.html',
  styleUrl: './discover.css',
})
export class Discover {}
