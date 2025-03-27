import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  group: FormGroup
): { [key: string]: boolean } | null {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');
  let mismatch = { mismatch: true };

  if (!password || !confirmPassword) {
    return null;
  }

  if (confirmPassword.value && !confirmPassword.hasError('mismatch')) {
    password.valueChanges.subscribe(() => {
      confirmPassword.updateValueAndValidity();
    });
  }

  if (!confirmPassword.errors && password.value !== confirmPassword.value) {
    confirmPassword.setErrors(mismatch);
  }

  if (password.value && confirmPassword.value) {
    const isMatch = password.value === confirmPassword.value;
    return isMatch ? null : mismatch;
  }

  return null;
}

export function minAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // No value, no validation needed

    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // Adjust for exact birthdate comparison
    if (
      age > minAge ||
      (age === minAge &&
        today.getMonth() >= birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate())
    ) {
      return null; // Valid age
    }

    return { minAge: true }; // Invalid age
  };
}