import { Component, computed, effect, ElementRef, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Track } from '../../../core/models/track.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DatePipe } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

@Component({
  selector: 'app-track-item',
  imports: [DurationPipe, DatePipe, RouterLink],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  protected readonly AppRoutes = AppRoutes;
  track = input.required<Track>();
  isSearchVersion = input<boolean>(false);
  queue = input<Track[]>([]);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly playerService = inject(PlayerService);
  readonly isCurrentTrack = computed(
    () => this.playerService.currentTrack()?.id === this.track().id,
  );
  readonly isPlaying = computed(() => this.isCurrentTrack() && this.playerService.isPlaying());

  constructor() {
    effect(() => {
      if (this.isCurrentTrack()) {
        this.hostRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  onTrackClick() {
    this.playerService.toggle(this.track(), this.queue());
  }
}
