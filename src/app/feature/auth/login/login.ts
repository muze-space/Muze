import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected readonly modalService = inject(ModalService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
    const redirectTo = this.modalService.loginRedirect();

    this.authService.login();
    this.modalService.closeLogin();

    if (redirectTo) {
      void this.router.navigateByUrl(redirectTo);
    }
  }
}
