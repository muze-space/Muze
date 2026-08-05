import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [Footer] });
    fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
  });

  it('renders the copyright line inside a footer landmark', () => {
    const footer: HTMLElement = fixture.nativeElement.querySelector('footer');

    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Muze');
  });
});
