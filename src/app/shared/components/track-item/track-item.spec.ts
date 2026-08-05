import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TrackItem } from './track-item';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { LikedTracksService } from '../../../core/services/liked-tracks.service';
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

describe('TrackItem', () => {
  let fixture: ComponentFixture<TrackItem>;

  function likeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.like-btn');
  }

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TrackItem],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(TrackItem);
    fixture.componentRef.setInput('track', makeTrack('a'));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders the track name', () => {
    expect(fixture.nativeElement.querySelector('.title').textContent).toContain('Track a');
  });

  it('likes the track when authenticated', () => {
    TestBed.inject(AuthService).login();

    likeButton().click();

    expect(TestBed.inject(LikedTracksService).isLiked('a')).toBe(true);
  });

  it('shows no liked state while logged out, even with likes in storage', async () => {
    const auth = TestBed.inject(AuthService);
    auth.login();
    likeButton().click();
    fixture.detectChanges();
    expect(likeButton().classList).toContain('liked');

    auth.logout();
    fixture.detectChanges();

    expect(likeButton().classList).not.toContain('liked');
    expect(TestBed.inject(LikedTracksService).isLiked('a')).toBe(true);
  });

  it('asks for a login instead of liking while logged out', () => {
    likeButton().click();

    expect(TestBed.inject(LikedTracksService).isLiked('a')).toBe(false);
    expect(TestBed.inject(ModalService).isLoginOpen()).toBe(true);
  });
});
