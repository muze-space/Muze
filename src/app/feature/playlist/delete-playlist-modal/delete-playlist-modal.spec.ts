import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DeletePlaylistModal } from './delete-playlist-modal';
import { ModalService } from '../../../core/services/modal.service';
import { PlaylistService } from '../../../core/services/playlist.service';

describe('DeletePlaylistModal', () => {
  let fixture: ComponentFixture<DeletePlaylistModal>;
  let modalService: ModalService;
  let playlistService: PlaylistService;
  let playlistId: string;

  function render(): void {
    fixture = TestBed.createComponent(DeletePlaylistModal);
    fixture.detectChanges();
  }

  function click(selector: string): void {
    fixture.nativeElement.querySelector(selector).click();
    fixture.detectChanges();
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DeletePlaylistModal],
      providers: [provideRouter([])],
    });

    modalService = TestBed.inject(ModalService);
    playlistService = TestBed.inject(PlaylistService);
    playlistId = playlistService.create('Chill').id;

    modalService.openDeletePlaylist(playlistId);
  });

  it('names the playlist being deleted', () => {
    render();

    expect(fixture.nativeElement.textContent).toContain('Chill');
  });

  it('Delete removes the playlist and closes', () => {
    render();

    click('.delete-playlist__confirm');

    expect(playlistService.getById(playlistId)).toBeUndefined();
    expect(modalService.activeModal()).toBeNull();
  });

  it('Cancel leaves the playlist alone', () => {
    render();

    click('.delete-playlist__cancel');

    expect(playlistService.getById(playlistId)).toBeTruthy();
    expect(modalService.activeModal()).toBeNull();
  });

  it('navigates away only when the deleted playlist is the open one', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    vi.spyOn(router, 'url', 'get').mockReturnValue('/');

    render();
    click('.delete-playlist__confirm');

    expect(navigate).not.toHaveBeenCalled();
  });

  it('leaves the playlist page when it is the one being deleted', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    vi.spyOn(router, 'url', 'get').mockReturnValue(`/playlist/${playlistId}`);

    render();
    click('.delete-playlist__confirm');

    expect(navigate).toHaveBeenCalledWith(['/library']);
  });
});
