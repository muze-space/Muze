import { PlayerService } from './player.service';
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

describe('PlayerService', () => {
  let service: PlayerService;
  const trackA = makeTrack('a');
  const trackB = makeTrack('b');
  const trackC = makeTrack('c');

  beforeEach(() => {
    service = new PlayerService();
  });

  it('starts with no current track and playback paused', () => {
    expect(service.currentTrack()).toBeNull();
    expect(service.isPlaying()).toBe(false);
  });

  it('play() sets the current track, starts playback and stores the queue', () => {
    service.play(trackA, [trackA, trackB]);

    expect(service.currentTrack()).toBe(trackA);
    expect(service.isPlaying()).toBe(true);
    expect(service.queue()).toEqual([trackA, trackB]);
  });

  it('play() resets time/duration only when switching to a different track', () => {
    service.play(trackA, [trackA, trackB]);
    service.setCurrentTime(42);
    service.setDuration(100);

    service.play(trackA);
    expect(service.currentTime()).toBe(42);
    expect(service.duration()).toBe(100);

    service.play(trackB);
    expect(service.currentTime()).toBe(0);
    expect(service.duration()).toBe(0);
  });

  it('pause() stops playback without clearing the current track', () => {
    service.play(trackA);
    service.pause();

    expect(service.isPlaying()).toBe(false);
    expect(service.currentTrack()).toBe(trackA);
  });

  it('toggle() pauses when the same track is already playing', () => {
    service.play(trackA);
    service.toggle(trackA);

    expect(service.isPlaying()).toBe(false);
    expect(service.currentTrack()).toBe(trackA);
  });

  it('toggle() plays a new track when a different track is passed', () => {
    service.play(trackA);
    service.toggle(trackB, [trackA, trackB]);

    expect(service.isPlaying()).toBe(true);
    expect(service.currentTrack()).toBe(trackB);
  });

  it('togglePlayback() flips isPlaying when a track is loaded', () => {
    service.play(trackA);
    service.togglePlayback();
    expect(service.isPlaying()).toBe(false);

    service.togglePlayback();
    expect(service.isPlaying()).toBe(true);
  });

  it('togglePlayback() is a no-op when there is no current track', () => {
    service.togglePlayback();
    expect(service.isPlaying()).toBe(false);
    expect(service.currentTrack()).toBeNull();
  });

  it('next() advances to the next track in the queue and wraps around', () => {
    service.play(trackA, [trackA, trackB, trackC]);

    service.next();
    expect(service.currentTrack()).toBe(trackB);

    service.next();
    expect(service.currentTrack()).toBe(trackC);

    service.next();
    expect(service.currentTrack()).toBe(trackA);
  });

  it('previous() moves to the previous track in the queue and wraps around', () => {
    service.play(trackA, [trackA, trackB, trackC]);

    service.previous();
    expect(service.currentTrack()).toBe(trackC);
  });

  it('next()/previous() are no-ops when the queue is empty', () => {
    service.next();
    expect(service.currentTrack()).toBeNull();

    service.previous();
    expect(service.currentTrack()).toBeNull();
  });

  it('setVolume() updates the volume signal', () => {
    service.setVolume(0.5);
    expect(service.volume()).toBe(0.5);
  });
});
