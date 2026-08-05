import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueuePanel } from './queue-panel';
import { PlayerService } from '../../../core/services/player.service';
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

describe('QueuePanel', () => {
  let fixture: ComponentFixture<QueuePanel>;
  let player: PlayerService;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [QueuePanel] });
    fixture = TestBed.createComponent(QueuePanel);
    player = TestBed.inject(PlayerService);
    await fixture.whenStable();
  });

  it('renders nothing while the panel is closed', () => {
    expect(fixture.nativeElement.querySelector('.queue')).toBeFalsy();
  });

  it('lists only the tracks after the current one', async () => {
    player.play(makeTrack('a'), [makeTrack('a'), makeTrack('b'), makeTrack('c')]);
    player.isQueueOpen.set(true);
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll('.queue__list .queue__row');
    expect(rows.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Now playing');
  });

  it('removing a row drops it from the queue', async () => {
    player.play(makeTrack('a'), [makeTrack('a'), makeTrack('b')]);
    player.isQueueOpen.set(true);
    await fixture.whenStable();

    const remove: HTMLButtonElement = fixture.nativeElement.querySelector('.queue__remove');
    remove.click();
    await fixture.whenStable();

    expect(player.queue().map((track) => track.id)).toEqual(['a']);
  });

  it('clearing empties the queue', async () => {
    player.play(makeTrack('a'), [makeTrack('a'), makeTrack('b')]);
    player.isQueueOpen.set(true);
    await fixture.whenStable();

    const clear: HTMLButtonElement = fixture.nativeElement.querySelector('.queue__text-btn');
    clear.click();

    expect(player.queue()).toEqual([]);
  });
});
