import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  private _elementRef = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this._elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.appClickOutside.emit();
    }
  }
}
