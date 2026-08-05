import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AudioPlayer } from './audio-player';
import { PlayerService } from '../../../core/services/player.service';
import { Track } from '../../../core/models/track.model';

function makeTrack(): Track {
  return {
    id: '1',
    name: 'Track',
    duration: 100,
    artist_id: 'artist-1',
    artist_name: 'Artist',
    artist_idstr: '',
    album_name: 'Album',
    album_id: 'album-1',
    license_ccurl: '',
    position: 0,
    releasedate: '2024-01-01',
    album_image: '',
    audio: '',
    audiodownload: '',
    prourl: '',
    shorturl: '',
    shareurl: '',
    waveform: '',
    image: '',
    audiodownload_allowed: false,
    content_id_free: false,
  };
}

describe('AudioPlayer', () => {
  let component: AudioPlayer;
  let fixture: ComponentFixture<AudioPlayer>;
  let playerService: PlayerService;

  beforeEach(async () => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [AudioPlayer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioPlayer);
    component = fixture.componentInstance;
    playerService = TestBed.inject(PlayerService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders nothing when no track is playing', () => {
    fixture.detectChanges();
    const playerBar = fixture.nativeElement.querySelector('.player-bar');
    expect(playerBar).toBeFalsy();
  });

  it('links the artist name to the artist page', () => {
    playerService.play(makeTrack());
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.player-bar__artist');

    expect(link.getAttribute('href')).toBe('/artist/artist-1');
  });

  it('renders the audio element once a track is playing', () => {
    playerService.play(makeTrack());
    fixture.detectChanges();

    const audioElement = fixture.nativeElement.querySelector('audio');
    expect(audioElement).toBeTruthy();
  });
});
