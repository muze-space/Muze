import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

/**
 * Presentational dialog shell: backdrop, panel, title and close affordances.
 * Content is projected, so each dialog only owns its own body.
 */
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly title = input.required<string>();
  readonly closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onClose();
  }
}
