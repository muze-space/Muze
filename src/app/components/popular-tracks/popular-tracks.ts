import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { JamendoTrack, JamendoTracksResponse } from '../../model/track.model';
import { API_CONFIG } from '../../config';

@Component({
  selector: 'app-popular-tracks',
  imports: [],
  templateUrl: './popular-tracks.html',
  styleUrl: './popular-tracks.css',
})
export class PopularTracks implements OnInit {
  private httpClient = inject(HttpClient);
  tracks = signal<JamendoTrack[]>([]);

  ngOnInit() {
    this.httpClient.get<JamendoTracksResponse>(`${API_CONFIG.baseUrl}/tracks/`, {
      params: {
        client_id: API_CONFIG.clientId,
        format: 'jsonpretty',
        limit: '10',
        order: 'popularity_total',
      },
    }).subscribe(response => this.tracks.set(response.results));
  }
}
