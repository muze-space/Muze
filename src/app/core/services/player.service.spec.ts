import { PlayerService } from './player.service';
import { Track } from '../models/track.model';
import { RepeatMode } from '../enums/repeat-mode.enum';

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

  it('next() advances through the queue', () => {
    service.play(trackA, [trackA, trackB, trackC]);

    service.next();
    expect(service.currentTrack()).toBe(trackB);

    service.next();
    expect(service.currentTrack()).toBe(trackC);
  });

  it('next() stops playback at the end of the queue when repeat is off', () => {
    service.play(trackC, [trackA, trackB, trackC]);

    service.next();

    expect(service.currentTrack()).toBe(trackC);
    expect(service.isPlaying()).toBe(false);
  });

  it('next() wraps around when repeat is set to all', () => {
    service.play(trackC, [trackA, trackB, trackC]);
    service.repeatMode.set(RepeatMode.All);

    service.next();

    expect(service.currentTrack()).toBe(trackA);
    expect(service.isPlaying()).toBe(true);
  });

  it('previous() stays put at the start of the queue when repeat is off', () => {
    service.play(trackA, [trackA, trackB, trackC]);

    service.previous();

    expect(service.currentTrack()).toBe(trackA);
  });

  it('previous() wraps to the end when repeat is set to all', () => {
    service.play(trackA, [trackA, trackB, trackC]);
    service.repeatMode.set(RepeatMode.All);

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

  it('tracks position by index, so a duplicated track does not jump the queue', () => {
    service.play(trackA, [trackA, trackB, trackA]);

    service.next();
    service.next();

    expect(service.currentIndex()).toBe(2);
    expect(service.currentTrack()).toBe(trackA);
  });

  it('playAt() jumps to a queue position and ignores out-of-range indexes', () => {
    service.play(trackA, [trackA, trackB, trackC]);

    service.playAt(2);
    expect(service.currentTrack()).toBe(trackC);

    service.playAt(9);
    expect(service.currentTrack()).toBe(trackC);
  });

  it('cycleRepeat() steps off -> all -> one -> off', () => {
    expect(service.repeatMode()).toBe(RepeatMode.Off);

    service.cycleRepeat();
    expect(service.repeatMode()).toBe(RepeatMode.All);

    service.cycleRepeat();
    expect(service.repeatMode()).toBe(RepeatMode.One);
    expect(service.isRepeatOne()).toBe(true);

    service.cycleRepeat();
    expect(service.repeatMode()).toBe(RepeatMode.Off);
  });

  it('toggleShuffle() keeps the current track in place and restores the original order', () => {
    const queue = [trackA, trackB, trackC];
    service.play(trackB, queue);

    service.toggleShuffle();
    expect(service.isShuffled()).toBe(true);
    expect(service.currentTrack()).toBe(trackB);
    expect(service.currentIndex()).toBe(1);
    expect(
      service
        .queue()
        .map((track) => track.id)
        .sort(),
    ).toEqual(['a', 'b', 'c']);

    service.toggleShuffle();
    expect(service.isShuffled()).toBe(false);
    expect(service.queue()).toEqual(queue);
    expect(service.currentTrack()).toBe(trackB);
  });

  it('addToQueue() appends and playNext() inserts right after the current track', () => {
    service.play(trackA, [trackA, trackB]);

    service.addToQueue(trackC);
    expect(service.queue()).toEqual([trackA, trackB, trackC]);

    service.playNext(trackC);
    expect(service.queue()).toEqual([trackA, trackC, trackB, trackC]);
    expect(service.currentTrack()).toBe(trackA);
  });

  it('upNext() lists only the tracks after the current one', () => {
    service.play(trackA, [trackA, trackB, trackC]);
    expect(service.upNext()).toEqual([trackB, trackC]);

    service.next();
    expect(service.upNext()).toEqual([trackC]);
  });

  it('removeFromQueue() keeps the current track when an earlier one is removed', () => {
    service.play(trackC, [trackA, trackB, trackC]);

    service.removeFromQueue(0);

    expect(service.queue()).toEqual([trackB, trackC]);
    expect(service.currentTrack()).toBe(trackC);
  });

  it('removeFromQueue() stops playback once the queue is empty', () => {
    service.play(trackA, [trackA]);

    service.removeFromQueue(0);

    expect(service.queue()).toEqual([]);
    expect(service.currentTrack()).toBeNull();
    expect(service.isPlaying()).toBe(false);
  });

  it('moveInQueue() reorders without restarting the current track', () => {
    service.play(trackA, [trackA, trackB, trackC]);
    service.setCurrentTime(30);

    service.moveInQueue(2, 0);

    expect(service.queue()).toEqual([trackC, trackA, trackB]);
    expect(service.currentTrack()).toBe(trackA);
    expect(service.currentTime()).toBe(30);
  });

  it('clearQueue() empties the queue and pauses', () => {
    service.play(trackA, [trackA, trackB]);

    service.clearQueue();

    expect(service.queue()).toEqual([]);
    expect(service.currentTrack()).toBeNull();
    expect(service.isPlaying()).toBe(false);
  });

  it('playShuffled() turns shuffle on and starts playing the collection', () => {
    service.playShuffled([trackA, trackB, trackC]);

    expect(service.isShuffled()).toBe(true);
    expect(service.isPlaying()).toBe(true);
    expect(service.queue().length).toBe(3);
  });

  it('seekTo() moves the time and bumps the seek token', () => {
    const before = service.seekToken();

    service.seekTo(42);

    expect(service.currentTime()).toBe(42);
    expect(service.seekToken()).toBe(before + 1);
  });
});
