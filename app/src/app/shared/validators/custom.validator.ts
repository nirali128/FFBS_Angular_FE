import { FormGroup } from '@angular/forms';

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