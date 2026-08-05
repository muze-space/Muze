import { TrackOrder } from '../enums/track-order.enum';
import { TrackGenre } from '../constants/genre.const';

export interface TrackCriteria {
  order: TrackOrder;
  genre?: TrackGenre;
  search?: string;
  artistId?: string;
}
