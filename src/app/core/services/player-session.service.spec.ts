import { TestBed } from '@angular/core/testing';
import { PlayerSessionService } from './player-session.service';
import { PlayerService } from './player.service';
import { PlayHistoryService } from './play-history.service';
import { Track } from '../models/track.model';
import { RepeatMode } from '../enums/repeat-mode.enum';

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

function startSession(): PlayerService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  TestBed.inject(PlayerSessionService);
  return TestBed.inject(PlayerService);
}

describe('PlayerSessionService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('records played tracks in the history', () => {
    const player = startSession();
    const history = TestBed.inject(PlayHistoryService);

    player.play(makeTrack('a'), [makeTrack('a'), makeTrack('b')]);
    TestBed.tick();

    player.next();
    TestBed.tick();

    expect(history.history().map((track) => track.id)).toEqual(['b', 'a']);
  });

  it('restores queue, position, volume and modes but stays paused', () => {
    const player = startSession();

    player.play(makeTrack('b'), [makeTrack('a'), makeTrack('b'), makeTrack('c')]);
    player.setVolume(0.4);
    player.repeatMode.set(RepeatMode.All);
    player.setCurrentTime(37);
    TestBed.tick();

    const restored = startSession();

    expect(restored.queue().map((track) => track.id)).toEqual(['a', 'b', 'c']);
    expect(restored.currentTrack()?.id).toBe('b');
    expect(restored.currentTime()).toBe(37);
    expect(restored.volume()).toBe(0.4);
    expect(restored.repeatMode()).toBe(RepeatMode.All);
    expect(restored.isPlaying()).toBe(false);
  });

  it('starts clean when nothing was saved', () => {
    const player = startSession();

    expect(player.queue()).toEqual([]);
    expect(player.currentTrack()).toBeNull();
  });

  it('clearing the queue drops the saved session', () => {
    const player = startSession();
    player.play(makeTrack('a'), [makeTrack('a')]);
    TestBed.tick();

    player.clearQueue();
    TestBed.tick();

    expect(startSession().queue()).toEqual([]);
  });
});
