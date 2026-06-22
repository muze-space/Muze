import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Search } from '../../components/search/search.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { NgOptimizedImage } from '@angular/common';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-header',
  imports: [Search, RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly AppRoutes = AppRoutes;
  protected readonly modalService = inject(ModalService);
}
