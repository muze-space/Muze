import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-header',
  imports: [SearchComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly modalService = inject(ModalService);
}
