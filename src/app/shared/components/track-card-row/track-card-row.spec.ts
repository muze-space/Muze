import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackCardRow } from './track-card-row';
import { PlayerService } from '../../../core/services/player.service';
import { Track } from '../../../core/models/track.model';

function makeTrack(id: string): Track {
  return {
    id,
    name: `Track ${id}`,
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

describe('TrackCardRow', () => {
  let fixture: ComponentFixture<TrackCardRow>;
  let player: PlayerService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TrackCardRow] });
    fixture = TestBed.createComponent(TrackCardRow);
    player = TestBed.inject(PlayerService);
    fixture.componentRef.setInput('tracks', [makeTrack('a'), makeTrack('b')]);
    await fixture.whenStable();
  });

  it('renders one card per track', () => {
    expect(fixture.nativeElement.querySelectorAll('.card-row__card').length).toBe(2);
  });

  it('clicking a card plays it with the row as the queue', () => {
    fixture.nativeElement.querySelectorAll('.card-row__card')[1].click();

    expect(player.currentTrack()?.id).toBe('b');
    expect(player.queue().map((track) => track.id)).toEqual(['a', 'b']);
  });

  it('clicking the playing card pauses it', async () => {
    const card: HTMLButtonElement = fixture.nativeElement.querySelector('.card-row__card');

    card.click();
    await fixture.whenStable();
    card.click();

    expect(player.isPlaying()).toBe(false);
  });
});
