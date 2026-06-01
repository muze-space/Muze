import { Component, Input } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-track-item',
  imports: [DurationPipe],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  @Input() track!: Track;
}
