import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SuccessMessages } from '../../shared/constants/messages-const';
import { SnackbarConfig } from '../../shared/constants/snackbar-config.const';
import {
  ValidationRules,
  ValidationPatterns,
} from '../../shared/constants/validation.const';
import { ApiResponse } from '../../shared/interfaces/api.response';
import { DropdownOption } from '../../shared/interfaces/dropdown.options';
import { Register } from '../../shared/interfaces/register';
import { AuthService } from '../../shared/service/authentication.service';
import { RoleService } from '../../shared/service/role.service';
import { SnackbarService } from '../../shared/service/snackbar.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-profile',
  imports: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  registrationForm: FormGroup;

  roleOptions: DropdownOption[];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public roleService: RoleService,
    private snackBarService: SnackbarService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.roleService.getRole().subscribe((res) => {
      this.roleOptions = res.data;
    });

    this.registrationForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(ValidationRules.FIELD_NAME_MAX_LENGTH),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(ValidationRules.FIELD_NAME_MAX_LENGTH),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(ValidationRules.EMAIL_MAX_LENGTH),
          Validators.pattern(ValidationPatterns.EMAIL),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(ValidationPatterns.PHONE)],
      ],
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.registrationForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.authService
        .register(this.registrationForm.value as Register)
        .subscribe((res: ApiResponse<Register>) => {
          if (res.success) {
            this.snackBarService.show(
              new SnackbarConfig({
                message: SuccessMessages.USER_REGISTRATION_SUCCESS,
              })
            );
            this.router.navigateByUrl('login');
          }
        });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  restrictTextInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
    if (!/^[A-Za-z ]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  restrictPhoneInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (
      ValidationPatterns.PHONE.test(event.key) &&
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '50%',
    });
  }
}
