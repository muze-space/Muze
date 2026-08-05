import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';

describe('Modal', () => {
  let fixture: ComponentFixture<Modal>;
  let closed: number;

  beforeEach(async () => {
    closed = 0;

    TestBed.configureTestingModule({ imports: [Modal] });
    fixture = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('title', 'New playlist');
    fixture.componentInstance.closed.subscribe(() => (closed += 1));
    await fixture.whenStable();
  });

  it('renders the title it is given', () => {
    expect(fixture.nativeElement.querySelector('.modal__title').textContent).toContain(
      'New playlist',
    );
  });

  it('exposes the panel as a modal dialog to assistive tech', () => {
    const panel: HTMLElement = fixture.nativeElement.querySelector('.modal');

    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
  });

  it('emits closed when the close button is clicked', () => {
    fixture.nativeElement.querySelector('.modal__close').click();

    expect(closed).toBe(1);
  });

  it('emits closed when the backdrop is clicked', () => {
    fixture.nativeElement.querySelector('.overlay__backdrop').click();

    expect(closed).toBe(1);
  });

  it('keeps the backdrop out of the tab order', () => {
    const backdrop: HTMLElement = fixture.nativeElement.querySelector('.overlay__backdrop');

    expect(backdrop.getAttribute('tabindex')).toBe('-1');
    expect(backdrop.getAttribute('aria-hidden')).toBe('true');
  });

  it('emits closed on Escape', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closed).toBe(1);
  });

  it('does not close when the panel itself is clicked', () => {
    fixture.nativeElement.querySelector('.modal').click();

    expect(closed).toBe(0);
  });
});
