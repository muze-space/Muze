import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { TracksResponse } from '../../../core/models/tracks-response.model';
import { API_CONFIG } from '../../../config';
import { TrackItem } from "../track-item/track-item";

@Component({
  selector: 'app-popular-tracks',
  imports: [TrackItem],
  templateUrl: './popular-tracks.html',
  styleUrl: './popular-tracks.css',
})
export class PopularTracks implements OnInit {

  @Input() limit!: number;

  private httpClient = inject(HttpClient);
  tracks = signal<Track[]>([]);

  ngOnInit() {
    this.httpClient.get<TracksResponse>(`${API_CONFIG.baseUrl}/tracks/`, {
      params: {
        client_id: API_CONFIG.clientId,
        format: 'jsonpretty',
        limit: this.limit.toString(),
        order: 'popularity_total',
      },
    }).subscribe(response => this.tracks.set(response.results));
  }
}
