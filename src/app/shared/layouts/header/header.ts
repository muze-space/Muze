import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { ModalService } from '../../../core/services/modal.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

@Component({
  selector: 'app-header',
  imports: [SearchComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly modalService = inject(ModalService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected onLogout(): void {
    this.authService.logout();

    const onGuardedPage = [AppRoutes.Library, AppRoutes.Playlist].some((route) =>
      this.router.url.startsWith(`/${route}`),
    );

    if (onGuardedPage) {
      void this.router.navigate(['/' + AppRoutes.Home]);
    }
  }
}
