import { TestBed } from '@angular/core/testing';
import { PlayHistoryService } from './play-history.service';
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

function createService(): PlayHistoryService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(PlayHistoryService);
}

describe('PlayHistoryService', () => {
  let service: PlayHistoryService;

  beforeEach(() => {
    localStorage.clear();
    service = createService();
  });

  it('starts empty', () => {
    expect(service.history()).toEqual([]);
  });

  it('add() puts the newest track first', () => {
    service.add(makeTrack('a'));
    service.add(makeTrack('b'));

    expect(service.history().map((track) => track.id)).toEqual(['b', 'a']);
  });

  it('add() moves a repeated track back to the front instead of duplicating it', () => {
    service.add(makeTrack('a'));
    service.add(makeTrack('b'));
    service.add(makeTrack('a'));

    expect(service.history().map((track) => track.id)).toEqual(['a', 'b']);
  });

  it('add() ignores a track that is already on top', () => {
    service.add(makeTrack('a'));
    service.add(makeTrack('a'));

    expect(service.history().map((track) => track.id)).toEqual(['a']);
  });

  it('keeps at most 20 entries', () => {
    for (let i = 0; i < 25; i++) {
      service.add(makeTrack(`t${i}`));
    }

    expect(service.history().length).toBe(20);
    expect(service.history()[0].id).toBe('t24');
  });

  it('persists across instances and clear() empties it', () => {
    service.add(makeTrack('a'));

    expect(
      createService()
        .history()
        .map((track) => track.id),
    ).toEqual(['a']);

    service.clear();
    expect(createService().history()).toEqual([]);
  });
});
