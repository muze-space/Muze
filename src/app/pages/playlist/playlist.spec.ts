import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PlaylistPage } from './playlist';
import { PlaylistService } from '../../core/services/playlist.service';
import { PlayerService } from '../../core/services/player.service';
import { Track } from '../../core/models/track.model';

function makeTrack(id: string, duration = 180): Track {
  return {
    id,
    name: `Track ${id}`,
    duration,
    artist_id: 'artist-1',
    artist_name: 'Artist',
    album_name: 'Album',
    album_id: 'album-1',
    releasedate: '2024-01-01',
    album_image: `cover-${id}.jpg`,
    audio: '',
  };
}

describe('PlaylistPage', () => {
  let fixture: ComponentFixture<PlaylistPage>;
  let playlistService: PlaylistService;
  let playlistId: string;

  async function setup(): Promise<void> {
    localStorage.clear();
    playlistId = '';

    TestBed.configureTestingModule({
      imports: [PlaylistPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => playlistId } as never) },
        },
      ],
    });

    playlistService = TestBed.inject(PlaylistService);
    playlistId = playlistService.create('Chill', 'evening mix').id;

    fixture = TestBed.createComponent(PlaylistPage);
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders the playlist name and description', async () => {
    await setup();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Chill');
    expect(text).toContain('evening mix');
  });

  it('shows the empty state when the playlist has no tracks', async () => {
    await setup();

    expect(fixture.nativeElement.textContent).toContain('This playlist is empty');
  });

  it('renders tracks with a total duration once they are added', async () => {
    await setup();

    playlistService.addTrack(playlistId, makeTrack('a', 200));
    playlistService.addTrack(playlistId, makeTrack('b', 200));
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('2 songs');
    expect(text).toContain('7 min');
    expect(fixture.nativeElement.querySelectorAll('app-track-item').length).toBe(2);
  });

  it('Play starts the first track with the playlist as the queue', async () => {
    await setup();

    playlistService.addTrack(playlistId, makeTrack('a'));
    playlistService.addTrack(playlistId, makeTrack('b'));
    await fixture.whenStable();

    const playButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.play-collection__play');
    playButton.click();

    const player = TestBed.inject(PlayerService);
    expect(player.currentTrack()?.id).toBe('a');
    expect(player.queue().length).toBe(2);
  });
});
