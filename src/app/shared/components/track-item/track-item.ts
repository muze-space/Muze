import { Component, Input } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-track-item',
  imports: [DurationPipe, DatePipe],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  @Input() track!: Track;
}
