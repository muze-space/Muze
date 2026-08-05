import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  it('starts with no modal open', () => {
    expect(service.activeModal()).toBeNull();
    expect(service.isLoginOpen()).toBe(false);
  });

  it('openLogin() opens the login modal', () => {
    service.openLogin();

    expect(service.activeModal()).toEqual({ kind: 'login' });
    expect(service.isLoginOpen()).toBe(true);
  });

  it('closeLogin() closes the login modal', () => {
    service.openLogin();
    service.closeLogin();

    expect(service.isLoginOpen()).toBe(false);
  });

  it('openCreatePlaylist() can carry a track to add', () => {
    const track = { id: 't1' } as never;
    service.openCreatePlaylist(track);

    expect(service.activeModal()).toEqual({ kind: 'createPlaylist', trackToAdd: track });
  });

  it('openRenamePlaylist() and openDeletePlaylist() carry the playlist id', () => {
    service.openRenamePlaylist('p1');
    expect(service.activeModal()).toEqual({ kind: 'renamePlaylist', playlistId: 'p1' });

    service.openDeletePlaylist('p1');
    expect(service.activeModal()).toEqual({ kind: 'deletePlaylist', playlistId: 'p1' });
  });

  it('opening a modal replaces the previous one', () => {
    service.openLogin();
    service.openCreatePlaylist();

    expect(service.isLoginOpen()).toBe(false);
    expect(service.activeModal()?.kind).toBe('createPlaylist');
  });

  it('close() clears the active modal', () => {
    service.openDeletePlaylist('p1');
    service.close();

    expect(service.activeModal()).toBeNull();
  });
});
