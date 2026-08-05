import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from '../../../core/services/toast.service';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let toastService: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [Toast] });
    fixture = TestBed.createComponent(Toast);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function messages(): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.toast__message')).map(
      (element) => element.textContent?.trim() ?? '',
    );
  }

  it('renders nothing until something is shown', () => {
    expect(messages()).toEqual([]);
  });

  it('stacks the messages in the order they arrive', () => {
    toastService.show('Added to queue');
    toastService.show('Playing next');
    fixture.detectChanges();

    expect(messages()).toEqual(['Added to queue', 'Playing next']);
  });

  it('dismisses a toast from its button', () => {
    toastService.show('Added to queue');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.toast__dismiss').click();
    fixture.detectChanges();

    expect(messages()).toEqual([]);
  });

  it('drops a toast on its own after five seconds', () => {
    toastService.show('Added to queue');
    fixture.detectChanges();

    vi.advanceTimersByTime(5000);
    fixture.detectChanges();

    expect(messages()).toEqual([]);
  });

  it('announces messages for assistive tech', () => {
    toastService.show('Created Chill');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast-container').getAttribute('aria-live')).toBe(
      'assertive',
    );
    expect(fixture.nativeElement.querySelector('.toast').getAttribute('role')).toBe('alert');
  });
});
