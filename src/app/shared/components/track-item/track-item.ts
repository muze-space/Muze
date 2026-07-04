import { Component, inject, input } from '@angular/core';
import { Track } from '../../../core/models/track.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DatePipe } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-track-item',
  imports: [DurationPipe, DatePipe],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  track = input.required<Track>();
  isSearchVersion = input<boolean>(false);
  queue = input<Track[]>([]);
  private readonly playerService = inject(PlayerService);

  onTrackClick() {
    this.playerService.toggle(this.track(), this.queue());
  }
}
