import { AbstractControl, ValidatorFn } from '@angular/forms';

export const noWhitespaceValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value;

  // Let Validators.required handle empty values
  if (value === null || value === undefined || value === '') return null;

  const isWhitespace = String(value).trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
};
