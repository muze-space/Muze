import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NowPlaying } from './now-playing';
import { PlayerService } from '../../../core/services/player.service';
import { Track } from '../../../core/models/track.model';

function makeTrack(): Track {
  return {
    id: '1',
    name: 'Some Song',
    duration: 100,
    artist_id: 'artist-1',
    artist_name: 'Some Artist',
    album_name: 'Some Album',
    album_id: 'album-1',
    releasedate: '2024-01-01',
    album_image: '',
    audio: '',
  };
}

describe('NowPlaying', () => {
  let fixture: ComponentFixture<NowPlaying>;
  let player: PlayerService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NowPlaying],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(NowPlaying);
    player = TestBed.inject(PlayerService);
    await fixture.whenStable();
  });

  it('stays hidden until it is opened', async () => {
    player.play(makeTrack());
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.now-playing')).toBeFalsy();
  });

  it('shows the current track once opened', async () => {
    player.play(makeTrack());
    player.openNowPlaying();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Some Song');
    expect(text).toContain('Some Artist');
    expect(text).toContain('Some Album');
  });

  it('the close button hides it again', async () => {
    player.play(makeTrack());
    player.openNowPlaying();
    await fixture.whenStable();

    const close: HTMLButtonElement = fixture.nativeElement.querySelector('.now-playing__close');
    close.click();
    await fixture.whenStable();

    expect(player.isNowPlayingOpen()).toBe(false);
    expect(fixture.nativeElement.querySelector('.now-playing')).toBeFalsy();
  });
});
