import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Feedback } from './feedback.component';

describe('Feedback', () => {
  let fixture: ComponentFixture<Feedback>;
  let component: Feedback;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [Feedback] });
    fixture = TestBed.createComponent(Feedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function fillIn(): void {
    component.feedbackForm.setValue({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'The player keeps my queue between reloads, which is lovely.',
    });
  }

  function alertText(): string {
    return fixture.nativeElement.querySelector('.alert')?.textContent ?? '';
  }

  it('shows a validation message after the field is touched and left empty', async () => {
    vi.useRealTimers();
    fixture.autoDetectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#name');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Name is required');
  });

  it('rejects an empty submit without pretending to send', () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(component.submitError()).toBe('Please fill in all required fields correctly');
    expect(alertText()).toContain('Please fill in all required fields correctly');
    expect(component.submitSuccess()).toBe(false);
  });

  it('renders the success message once the fake send finishes', () => {
    fillIn();

    component.onSubmit();
    fixture.detectChanges();

    expect(alertText()).not.toContain('Thanks!');

    vi.advanceTimersByTime(800);
    fixture.detectChanges();

    expect(component.submitSuccess()).toBe(true);
    expect(alertText()).toContain('Thanks!');
  });

  it('clears the form and hides the success message afterwards', () => {
    fillIn();

    component.onSubmit();
    vi.advanceTimersByTime(800);
    fixture.detectChanges();

    expect(component.feedbackForm.value.name).toBeNull();

    vi.advanceTimersByTime(5000);
    fixture.detectChanges();

    expect(component.submitSuccess()).toBe(false);
    expect(alertText()).toBe('');
  });
});
