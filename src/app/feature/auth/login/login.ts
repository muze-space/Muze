import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.css',
})
export class Login {
  protected readonly modalService = inject(ModalService);
}
