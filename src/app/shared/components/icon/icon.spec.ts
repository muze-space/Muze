import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon, IconName } from './icon';

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Icon] });
    fixture = TestBed.createComponent(Icon);
  });

  function render(name: IconName): SVGElement | null {
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();

    return fixture.nativeElement.querySelector('svg');
  }

  it('renders an svg for every known name', () => {
    const names: IconName[] = [
      'play',
      'pause',
      'previous',
      'next',
      'shuffle',
      'repeat',
      'repeat-one',
      'heart',
      'heart-filled',
      'queue',
      'close',
      'volume-high',
      'volume-low',
      'volume-mute',
    ];

    for (const name of names) {
      expect(render(name)?.querySelectorAll('path, rect, circle').length).toBeGreaterThan(0);
    }
  });

  it('hides the glyph from screen readers so the button label wins', () => {
    expect(render('play')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('swaps the markup when the name changes', () => {
    const outline = render('heart')?.outerHTML;
    const filled = render('heart-filled')?.outerHTML;

    expect(outline).not.toBe(filled);
  });
});
