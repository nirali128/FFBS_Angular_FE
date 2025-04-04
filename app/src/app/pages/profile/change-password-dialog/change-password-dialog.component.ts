import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/calendar/dialog/dialog.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordMatchValidator } from '../../../shared/validators/custom.validator';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/service/authentication.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ResetPassword } from '../../../shared/interfaces/user';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../shared/constants/snackbar-config.const';
import { SuccessMessages } from '../../../shared/constants/messages-const';
import { GlobalConstant } from '../../../shared/constants/global-const';
import * as CryptoJS from 'crypto-js';
import { ValidationPatterns } from '../../../shared/constants/validation.const';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    ButtonComponent,
    MatDialogModule,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
})
export class ChangePasswordDialogComponent {
  changePasswordForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,
    private router: Router,
    private readonly authService: AuthService,
    private readonly snackBarService: SnackbarService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.pattern(ValidationPatterns.PASSWORD)]],
        password: ['', [Validators.required, Validators.pattern(ValidationPatterns.PASSWORD)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: passwordMatchValidator }
    );
  }

  getFormControl(controlName: string): FormControl {
    return this.changePasswordForm.get(controlName) as FormControl;
  }

  back() {
    this.dialogRef.close()
    this.router.navigateByUrl('/profile');
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const formValue: ResetPassword = {
        email: this.authService.getEncryptedEmail(),
        password: this.changePasswordForm.get('password').value,
        oldPassword: this.changePasswordForm.get('oldPassword').value
      };
      this.authService.changePassword(formValue).subscribe((res) => {
        if(res.success) {
          this.snackBarService.show(
            new SnackbarConfig({
              message: res.message,
            })
          );
          this.back();
        }
      });
    } else {
      this.changePasswordForm.controls['password'].setErrors({required: true});
      this.changePasswordForm.controls['confirmPassword'].setErrors({required: true});
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
