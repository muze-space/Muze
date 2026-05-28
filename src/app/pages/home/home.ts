import { Component } from '@angular/core';
import { Tracks } from '../../shared/components/tracks/tracks';
import { TrackOrder } from '../../core/enums/track-order.enum';

@Component({
  selector: 'app-home',
  imports: [Tracks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly trackOrder = TrackOrder;
}
