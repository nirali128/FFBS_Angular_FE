import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/calendar/dialog/dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../shared/validators/custom.validator';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/service/authentication.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-change-password-dialog',
  imports: [ButtonComponent],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
})
export class ChangePasswordDialogComponent {
  changePasswordForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }

  back() {
    this.router.navigateByUrl('/dashboard');
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.auth.changePassword();
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
