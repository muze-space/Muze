import { TestBed } from '@angular/core/testing';
import { FollowedArtistsService } from './followed-artists.service';
import { Artist } from '../models/artist.model';

function makeArtist(id: string): Artist {
  return {
    id,
    name: `Artist ${id}`,
    website: '',
    joindate: '2024-01-01',
    image: '',
    shorturl: '',
    shareurl: '',
  };
}

function createService(): FollowedArtistsService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(FollowedArtistsService);
}

describe('FollowedArtistsService', () => {
  const artistA = makeArtist('a');
  const artistB = makeArtist('b');

  let service: FollowedArtistsService;

  beforeEach(() => {
    localStorage.clear();
    service = createService();
  });

  it('starts empty', () => {
    expect(service.artists()).toEqual([]);
    expect(service.isFollowed('a')).toBe(false);
  });

  it('follow() prepends the artist and is idempotent', () => {
    service.follow(artistA);
    service.follow(artistB);
    service.follow(artistA);

    expect(service.artists().map((artist) => artist.id)).toEqual(['b', 'a']);
  });

  it('unfollow() removes the artist', () => {
    service.follow(artistA);
    service.unfollow('a');

    expect(service.isFollowed('a')).toBe(false);
  });

  it('toggle() flips the follow state', () => {
    service.toggle(artistA);
    expect(service.isFollowed('a')).toBe(true);

    service.toggle(artistA);
    expect(service.isFollowed('a')).toBe(false);
  });

  it('persists across instances', () => {
    service.follow(artistA);

    expect(createService().isFollowed('a')).toBe(true);
  });
});
