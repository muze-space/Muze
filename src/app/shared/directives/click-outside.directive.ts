import { Directive, ElementRef, EventEmitter, inject, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  private _elementRef = inject(ElementRef<HTMLElement>);

  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this._elementRef.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
