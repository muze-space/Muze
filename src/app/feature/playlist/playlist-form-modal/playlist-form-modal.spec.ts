import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PlaylistFormModal } from './playlist-form-modal';
import { ModalService } from '../../../core/services/modal.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ToastService } from '../../../core/services/toast.service';
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

describe('PlaylistFormModal', () => {
  let fixture: ComponentFixture<PlaylistFormModal>;
  let modalService: ModalService;
  let playlistService: PlaylistService;

  /**
   * The dialog reads the active modal in its constructor, so the modal has to be
   * opened before the component is created.
   */
  function render(): void {
    fixture = TestBed.createComponent(PlaylistFormModal);
    fixture.detectChanges();
  }

  function nameInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[formControlName="name"]');
  }

  function descriptionInput(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('textarea[formControlName="description"]');
  }

  function type(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submit(): void {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PlaylistFormModal],
      providers: [provideRouter([])],
    });

    modalService = TestBed.inject(ModalService);
    playlistService = TestBed.inject(PlaylistService);
  });

  describe('create mode', () => {
    beforeEach(() => {
      modalService.openCreatePlaylist();
      render();
    });

    it('shows the create wording and an empty form', () => {
      expect(fixture.nativeElement.textContent).toContain('New playlist');
      expect(fixture.nativeElement.querySelector('.playlist-form__submit').textContent).toContain(
        'Create',
      );
      expect(nameInput().value).toBe('');
    });

    it('creates a playlist, closes and navigates to it', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');

      type(nameInput(), 'Chill');
      type(descriptionInput(), 'evening mix');
      submit();

      const [playlist] = playlistService.playlists();
      expect(playlist.name).toBe('Chill');
      expect(playlist.description).toBe('evening mix');
      expect(modalService.activeModal()).toBeNull();
      expect(navigate).toHaveBeenCalledWith(['/playlist', playlist.id]);
    });

    it('refuses to submit a blank name and reports it', () => {
      type(nameInput(), '   ');
      submit();

      expect(playlistService.playlists()).toEqual([]);
      expect(modalService.activeModal()).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.playlist-form__error')).toBeTruthy();
    });

    it('Cancel closes without creating anything', () => {
      type(nameInput(), 'Chill');
      fixture.nativeElement.querySelector('.playlist-form__cancel').click();

      expect(playlistService.playlists()).toEqual([]);
      expect(modalService.activeModal()).toBeNull();
    });
  });

  it('creating from a track adds that track and stays on the page', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    const toast = vi.spyOn(TestBed.inject(ToastService), 'show');

    modalService.openCreatePlaylist(makeTrack('a'));
    render();

    type(nameInput(), 'Chill');
    submit();

    const [playlist] = playlistService.playlists();
    expect(playlist.tracks.map((track) => track.id)).toEqual(['a']);
    expect(navigate).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith('Added to Chill');
  });

  describe('rename mode', () => {
    let playlistId: string;

    beforeEach(() => {
      playlistId = playlistService.create('Chill', 'evening mix').id;
      modalService.openRenamePlaylist(playlistId);
      render();
    });

    it('prefills the form with the current values', () => {
      expect(fixture.nativeElement.textContent).toContain('Edit playlist');
      expect(fixture.nativeElement.querySelector('.playlist-form__submit').textContent).toContain(
        'Save',
      );
      expect(nameInput().value).toBe('Chill');
      expect(descriptionInput().value).toBe('evening mix');
    });

    it('saves the changes without creating a second playlist', () => {
      type(nameInput(), 'Night');
      submit();

      expect(playlistService.playlists().length).toBe(1);
      expect(playlistService.getById(playlistId)?.name).toBe('Night');
      expect(modalService.activeModal()).toBeNull();
    });
  });
});
