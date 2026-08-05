import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayCollection } from './play-collection';
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

describe('PlayCollection', () => {
  let fixture: ComponentFixture<PlayCollection>;
  let player: PlayerService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [PlayCollection] });
    fixture = TestBed.createComponent(PlayCollection);
    player = TestBed.inject(PlayerService);
    fixture.componentRef.setInput('tracks', []);
    await fixture.whenStable();
  });

  it('disables both buttons for an empty collection', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );

    expect(buttons.every((button) => button.disabled)).toBe(true);
  });

  it('Play starts the first track with the whole collection queued', async () => {
    fixture.componentRef.setInput('tracks', [makeTrack('a'), makeTrack('b')]);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.play-collection__play').click();

    expect(player.currentTrack()?.id).toBe('a');
    expect(player.queue().length).toBe(2);
  });

  it('Shuffle turns shuffle on and starts playback', async () => {
    fixture.componentRef.setInput('tracks', [makeTrack('a'), makeTrack('b')]);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.play-collection__shuffle').click();

    expect(player.isShuffled()).toBe(true);
    expect(player.isPlaying()).toBe(true);
  });
});
