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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/service/user.service';
import { User } from '../../shared/interfaces/user';
import { minAgeValidator } from '../../shared/validators/custom.validator';
import { FormErrorsDirective } from '../../shared/directives/form-error.directive';

@Component({
  selector: 'app-profile',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule  
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileForm: FormGroup;
  email: string;
  roleOptions: DropdownOption[];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public roleService: RoleService,
    private snackBarService: SnackbarService,
    private router: Router,
    public dialog: MatDialog,
    public userService: UserService
  ) {
    this.profileForm = this.fb.group({
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
        { value: '', disabled: true },
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
      dob: ['', [Validators.required, minAgeValidator(14)]],
      avatar: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUserById().subscribe((res) => {
      if (res.success) {
        this.email = res.data.email;
        this.profileForm.patchValue(res.data);
      }
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.profileForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService
        .editUser(this.profileForm.value as User)
        .subscribe(() => {
          this.snackBarService.show(
            new SnackbarConfig({ message: SuccessMessages.USER_EDIT_SUCCESS })
          );
        });
    } else {
      this.profileForm.markAllAsTouched();
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileForm.patchValue({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '50%',
      data: this.email,
    });
  }

  navigate() {
    this.router.navigateByUrl('dashboard');
  }
}
