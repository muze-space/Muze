import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly _router = inject(Router);

  goHome(): void {
    this._router.navigate([AppRoutes.Home]).then(r => r);
  }
}
