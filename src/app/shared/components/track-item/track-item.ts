import { Component, Input } from '@angular/core';
import { JamendoTrack } from '../../../core/models/track.model';

@Component({
  selector: 'app-track-item',
  imports: [],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  @Input() track!: JamendoTrack;
}
