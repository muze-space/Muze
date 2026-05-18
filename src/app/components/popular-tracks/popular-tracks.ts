import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { JamendoTrack, JamendoTracksResponse } from '../../model/track.model';
import { API_CONFIG } from '../../config';
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
  tracks = signal<JamendoTrack[]>([]);

  ngOnInit() {
    this.httpClient.get<JamendoTracksResponse>(`${API_CONFIG.baseUrl}/tracks/`, {
      params: {
        client_id: API_CONFIG.clientId,
        format: 'jsonpretty',
        limit: this.limit.toString(),
        order: 'popularity_total',
      },
    }).subscribe(response => this.tracks.set(response.results));
  }
}
