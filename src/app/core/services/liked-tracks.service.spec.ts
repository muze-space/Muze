import { LikedTracksService } from './liked-tracks.service';
import { Track } from '../models/track.model';

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

describe('LikedTracksService', () => {
  const trackA = makeTrack('a');
  const trackB = makeTrack('b');

  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when localStorage has no saved tracks', () => {
    const service = new LikedTracksService();
    expect(service.likedTracks()).toEqual([]);
  });

  it('like() adds a track and isLiked() reflects it', () => {
    const service = new LikedTracksService();
    service.like(trackA);

    expect(service.isLiked('a')).toBe(true);
    expect(service.likedTracks()).toEqual([trackA]);
  });

  it('like() is a no-op if the track is already liked', () => {
    const service = new LikedTracksService();
    service.like(trackA);
    service.like(trackA);

    expect(service.likedTracks()).toEqual([trackA]);
  });

  it('unlike() removes a track', () => {
    const service = new LikedTracksService();
    service.like(trackA);
    service.like(trackB);
    service.unlike('a');

    expect(service.isLiked('a')).toBe(false);
    expect(service.likedTracks()).toEqual([trackB]);
  });

  it('toggle() likes an unliked track and unlikes a liked track', () => {
    const service = new LikedTracksService();
    service.toggle(trackA);
    expect(service.isLiked('a')).toBe(true);

    service.toggle(trackA);
    expect(service.isLiked('a')).toBe(false);
  });

  it('persists liked tracks to localStorage and restores them on init', () => {
    const service = new LikedTracksService();
    service.like(trackA);

    const restored = new LikedTracksService();
    expect(restored.likedTracks()).toEqual([trackA]);
  });
});
