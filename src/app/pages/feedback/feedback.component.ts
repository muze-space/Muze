import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../shared/utils/no-whitespace.validator';

const SUBMIT_DELAY_MS = 800;
const SUCCESS_MESSAGE_MS = 5000;

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {
  readonly hasAttemptedSubmit = signal(false);
  readonly isSending = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal<string | null>(null);

  private fb = inject(FormBuilder);

  feedbackForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), noWhitespaceValidator]],
    email: ['', [Validators.required, Validators.email]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000),
        noWhitespaceValidator,
      ],
    ],
  });

  onSubmit(): void {
    this.hasAttemptedSubmit.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);

    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      this.submitError.set('Please fill in all required fields correctly');
      return;
    }

    this.isSending.set(true);

    setTimeout(() => {
      this.isSending.set(false);
      this.submitSuccess.set(true);
      this.resetForm();

      setTimeout(() => this.submitSuccess.set(false), SUCCESS_MESSAGE_MS);
    }, SUBMIT_DELAY_MS);
  }

  resetForm(): void {
    this.feedbackForm.reset();
    this.hasAttemptedSubmit.set(false);
    this.submitError.set(null);
  }
}
