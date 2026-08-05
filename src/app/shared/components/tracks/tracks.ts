import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, merge, Subject, switchMap, tap } from 'rxjs';
import { Track } from '../../../core/models/track.model';
import { TrackItem } from '../track-item/track-item';
import { TracksService } from '../../../core/services/tracks.service';
import { TracksResponse } from '../../../core/models/tracks-response.model';
import { TrackOrder } from '../../../core/enums/track-order.enum';
import { TrackGenre } from '../../../core/constants/genre.const';

const PAGE_SIZE = 10;

interface TrackCriteria {
  order: TrackOrder;
  genre?: TrackGenre;
  search?: string;
  artistId?: string;
}

interface PageRequest {
  criteria: TrackCriteria;
  offset: number;
}

@Component({
  selector: 'app-tracks',
  imports: [TrackItem],
  templateUrl: './tracks.html',
  styleUrl: './tracks.css',
})
export class Tracks {
  order = input.required<TrackOrder>();
  genre = input<TrackGenre>();
  search = input<string>();
  artistId = input<string>();
  emptyMessage = input<string>('No tracks found.');
  tracks = signal<Track[]>([]);
  isLoading = signal<boolean>(false);
  isLoadingMore = signal<boolean>(false);
  hasMore = signal<boolean>(false);
  error = signal<string | null>(null);

  private readonly trackService = inject(TracksService);
  private offset = 0;

  private readonly criteria = computed<TrackCriteria>(() => ({
    order: this.order(),
    genre: this.genre(),
    search: this.search(),
    artistId: this.artistId(),
  }));

  private readonly loadMoreTrigger = new Subject<void>();

  constructor() {
    const firstPage$ = toObservable(this.criteria).pipe(
      map((criteria): PageRequest => ({ criteria, offset: 0 })),
    );

    const nextPage$ = this.loadMoreTrigger.pipe(
      map((): PageRequest => ({ criteria: this.criteria(), offset: this.offset })),
    );

    merge(firstPage$, nextPage$)
      .pipe(
        tap((request) => this.startRequest(request)),
        switchMap((request) => this.fetchPage(request)),
        takeUntilDestroyed(),
      )
      .subscribe(({ request, response }) => {
        this.applyPage(request, response);
        this.stopRequest(request);
      });
  }

  loadMore(): void {
    if (this.isLoadingMore() || !this.hasMore()) {
      return;
    }

    this.loadMoreTrigger.next();
  }

  private startRequest(request: PageRequest): void {
    this.error.set(null);

    if (request.offset === 0) {
      this.offset = 0;
      this.tracks.set([]);
      this.hasMore.set(false);
      this.isLoading.set(true);
      this.isLoadingMore.set(false);
      return;
    }

    this.isLoadingMore.set(true);
  }

  private fetchPage(request: PageRequest) {
    return this.trackService
      .getTracks({ ...request.criteria, limit: PAGE_SIZE, offset: request.offset })
      .pipe(
        map((response) => ({ request, response })),
        catchError((err) => {
          this.error.set(err);
          this.stopRequest(request);
          return EMPTY;
        }),
      );
  }

  private stopRequest(request: PageRequest): void {
    if (request.offset === 0) {
      this.isLoading.set(false);
      return;
    }

    this.isLoadingMore.set(false);
  }

  private applyPage(request: PageRequest, response: TracksResponse): void {
    if (request.offset === 0) {
      this.tracks.set(response.results);
      this.offset = response.results.length;
    } else {
      this.tracks.update((tracks) => [...tracks, ...response.results]);
      this.offset += response.results.length;
    }

    this.hasMore.set(!!response.headers.next);
  }
}
