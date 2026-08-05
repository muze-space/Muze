import { TestBed } from '@angular/core/testing';
import { PlaylistService } from './playlist.service';
import { Track } from '../models/track.model';

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

function createService(): PlaylistService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(PlaylistService);
}

describe('PlaylistService', () => {
  const trackA = makeTrack('a');
  const trackB = makeTrack('b');
  const trackC = makeTrack('c');

  let service: PlaylistService;

  beforeEach(() => {
    localStorage.clear();
    service = createService();
  });

  it('starts with no playlists', () => {
    expect(service.playlists()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('create() prepends a trimmed, empty playlist and returns it', () => {
    const first = service.create('  Chill  ', '  evening  ');
    const second = service.create('Focus');

    expect(first.name).toBe('Chill');
    expect(first.description).toBe('evening');
    expect(first.tracks).toEqual([]);
    expect(service.playlists().map((playlist) => playlist.id)).toEqual([second.id, first.id]);
  });

  it('getById() finds a playlist and returns undefined for an unknown id', () => {
    const playlist = service.create('Chill');

    expect(service.getById(playlist.id)?.name).toBe('Chill');
    expect(service.getById('nope')).toBeUndefined();
  });

  it('update() changes only the fields it is given', () => {
    const playlist = service.create('Chill', 'evening');

    service.update(playlist.id, { name: '  Night  ' });

    expect(service.getById(playlist.id)?.name).toBe('Night');
    expect(service.getById(playlist.id)?.description).toBe('evening');
  });

  it('remove() deletes the playlist', () => {
    const playlist = service.create('Chill');
    service.remove(playlist.id);

    expect(service.playlists()).toEqual([]);
  });

  it('addTrack() appends the track and reports success', () => {
    const playlist = service.create('Chill');

    expect(service.addTrack(playlist.id, trackA)).toBe(true);
    expect(service.getById(playlist.id)?.tracks).toEqual([trackA]);
  });

  it('addTrack() rejects duplicates and unknown playlists', () => {
    const playlist = service.create('Chill');
    service.addTrack(playlist.id, trackA);

    expect(service.addTrack(playlist.id, trackA)).toBe(false);
    expect(service.addTrack('nope', trackA)).toBe(false);
    expect(service.getById(playlist.id)?.tracks).toEqual([trackA]);
  });

  it('containsTrack() reflects playlist membership', () => {
    const playlist = service.create('Chill');
    service.addTrack(playlist.id, trackA);

    expect(service.containsTrack(playlist.id, 'a')).toBe(true);
    expect(service.containsTrack(playlist.id, 'b')).toBe(false);
    expect(service.containsTrack('nope', 'a')).toBe(false);
  });

  it('removeTrack() drops the matching track', () => {
    const playlist = service.create('Chill');
    service.addTrack(playlist.id, trackA);
    service.addTrack(playlist.id, trackB);

    service.removeTrack(playlist.id, 'a');

    expect(service.getById(playlist.id)?.tracks).toEqual([trackB]);
  });

  it('reorder() moves a track to the target index', () => {
    const playlist = service.create('Chill');
    service.addTrack(playlist.id, trackA);
    service.addTrack(playlist.id, trackB);
    service.addTrack(playlist.id, trackC);

    service.reorder(playlist.id, 0, 2);

    expect(service.getById(playlist.id)?.tracks.map((track) => track.id)).toEqual(['b', 'c', 'a']);
  });

  it('reorder() ignores out-of-range and no-op moves', () => {
    const playlist = service.create('Chill');
    service.addTrack(playlist.id, trackA);
    service.addTrack(playlist.id, trackB);

    service.reorder(playlist.id, 0, 0);
    service.reorder(playlist.id, -1, 1);
    service.reorder(playlist.id, 0, 5);

    expect(service.getById(playlist.id)?.tracks.map((track) => track.id)).toEqual(['a', 'b']);
  });

  it('persists playlists to localStorage and restores them on init', () => {
    const playlist = service.create('Chill');
    service.addTrack(playlist.id, trackA);

    const restored = createService();

    expect(restored.getById(playlist.id)?.tracks).toEqual([trackA]);
  });
});
