import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TrackMenu } from './track-menu';
import { PlayerService } from '../../../core/services/player.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { LikedTracksService } from '../../../core/services/liked-tracks.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { Track } from '../../../core/models/track.model';

function makeTrack(id: string): Track {
  return {
    id,
    name: `Track ${id}`,
    duration: 100,
    artist_id: 'artist-1',
    artist_name: 'Artist',
    album_name: 'Album',
    album_id: 'album-1',
    releasedate: '2024-01-01',
    album_image: '',
    audio: '',
  };
}

describe('TrackMenu', () => {
  let fixture: ComponentFixture<TrackMenu>;

  function itemLabelled(label: string): HTMLButtonElement | undefined {
    return Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('.track-menu__item'),
    ).find((button) => button.textContent?.trim().startsWith(label));
  }

  async function open(): Promise<void> {
    fixture.nativeElement.querySelector('.track-menu__btn').click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TrackMenu],
      providers: [provideRouter([])],
    });
    TestBed.inject(AuthService).login();
    fixture = TestBed.createComponent(TrackMenu);
    fixture.componentRef.setInput('track', makeTrack('a'));
    await fixture.whenStable();
  });

  it('stays closed until the button is clicked', async () => {
    expect(fixture.nativeElement.querySelector('.track-menu__list')).toBeFalsy();

    await open();

    expect(fixture.nativeElement.querySelector('.track-menu__list')).toBeTruthy();
  });

  it('hides the remove entry unless the row is removable', async () => {
    await open();
    expect(itemLabelled('Remove from this playlist')).toBeUndefined();

    fixture.componentRef.setInput('removable', true);
    await fixture.whenStable();

    expect(itemLabelled('Remove from this playlist')).toBeTruthy();
  });

  it('Add to queue appends the track to the player queue', async () => {
    const player = TestBed.inject(PlayerService);
    player.play(makeTrack('z'), [makeTrack('z')]);

    await open();
    itemLabelled('Add to queue')!.click();

    expect(player.queue().map((track) => track.id)).toEqual(['z', 'a']);
  });

  it('Play next inserts right after the current track', async () => {
    const player = TestBed.inject(PlayerService);
    player.play(makeTrack('z'), [makeTrack('z'), makeTrack('y')]);

    await open();
    itemLabelled('Play next')!.click();

    expect(player.queue().map((track) => track.id)).toEqual(['z', 'a', 'y']);
  });

  it('toggles the liked state', async () => {
    const liked = TestBed.inject(LikedTracksService);

    await open();
    itemLabelled('Save to Liked Songs')!.click();

    expect(liked.isLiked('a')).toBe(true);
  });

  it('the playlist submenu adds the track to the chosen playlist', async () => {
    const playlists = TestBed.inject(PlaylistService);
    const playlist = playlists.create('Chill');

    await open();
    itemLabelled('Add to playlist')!.click();
    await fixture.whenStable();

    itemLabelled('Chill')!.click();

    expect(playlists.containsTrack(playlist.id, 'a')).toBe(true);
  });

  describe('while logged out', () => {
    beforeEach(() => {
      TestBed.inject(LikedTracksService).toggle(makeTrack('a'));
      TestBed.inject(AuthService).logout();
    });

    it('asks for a login instead of touching the liked songs', async () => {
      const liked = TestBed.inject(LikedTracksService);

      await open();
      itemLabelled('Save to Liked Songs')!.click();
      await fixture.whenStable();

      expect(liked.isLiked('a')).toBe(true);
      expect(TestBed.inject(ModalService).isLoginOpen()).toBe(true);
    });

    it('offers to save rather than remove a track liked in another session', async () => {
      await open();

      expect(itemLabelled('Remove from Liked Songs')).toBeUndefined();
      expect(itemLabelled('Save to Liked Songs')).toBeTruthy();
    });

    it('asks for a login instead of opening the playlist submenu', async () => {
      await open();
      itemLabelled('Add to playlist')!.click();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('.track-menu__list')).toBeFalsy();
      expect(TestBed.inject(ModalService).isLoginOpen()).toBe(true);
    });
  });
});
