import { Component, HostListener, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly modalService = inject(ModalService);

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.modalService.closeLogin();
    }
  }

  // TODO: this is a demo login, not real authentication. Wiring up real Jamendo OAuth
  // requires a client secret and a redirect URI registered with Jamendo, which this
  // project doesn't have. Swap this out for a proper OAuth flow once those are available.
  onLogin(): void {
    localStorage.setItem('isAuthenticated', 'true');
    this.modalService.closeLogin();
  }
}
