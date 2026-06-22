import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface FeedbackForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class Feedback implements OnInit {
  feedbackForm!: FormGroup;
  isSubmitted = false;
  submitSuccess = false;
  submitError: string | null = null;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.submitError = null;
    this.submitSuccess = false;

    if (this.feedbackForm.invalid) {
      this.submitError = 'Please fill in all required fields correctly';
      return;
    }

    const formData = this.feedbackForm.value as FeedbackForm;
    console.log('Feedback submitted:', formData);

    setTimeout(() => {
      this.submitSuccess = true;
      this.isSubmitted = false;
      this.resetForm();

      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 800);
  }

  resetForm(): void {
    this.feedbackForm.reset();
    this.submitError = null;
  }
}
