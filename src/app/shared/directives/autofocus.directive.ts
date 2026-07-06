import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  private _elementRef = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    this._elementRef.nativeElement.focus();
  }
}
