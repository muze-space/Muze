import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  it('starts with the login modal closed', () => {
    expect(service.isLoginOpen()).toBe(false);
  });

  it('openLogin() opens the login modal', () => {
    service.openLogin();
    expect(service.isLoginOpen()).toBe(true);
  });

  it('closeLogin() closes the login modal', () => {
    service.openLogin();
    service.closeLogin();
    expect(service.isLoginOpen()).toBe(false);
  });
});
