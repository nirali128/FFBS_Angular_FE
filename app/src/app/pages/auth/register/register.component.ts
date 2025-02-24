import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DropdownOption } from '../../../shared/interfaces/dropdown.options';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../shared/service/authentication.service';
import { RoleService } from '../../../shared/service/role.service';
import {
  ValidationPatterns,
  ValidationRules,
} from '../../../shared/constants/validation.const';
import { Register } from '../../../shared/interfaces/register';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../shared/constants/snackbar-config.const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    ReactiveFormsModule,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registrationForm: FormGroup;
  errorMessages = {
    firstName: {
      required: 'First name is required',
      pattern: 'Only alphabetic characters are allowed',
    },
    lastName: {
      required: 'Last name is required',
      pattern: 'Only alphabetic characters are allowed',
    },
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email',
    },
    phoneNumber: {
      required: 'Phone number is required',
      pattern: 'Enter a valid phone number',
    },
    role: {
      required: 'Role is required',
    },
    password: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters long',
      pattern:
        'Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
    confirmPassword: {
      required: 'Confirm password is required',
      mismatch: 'Passwords do not match',
    },
  };

  roleOptions: DropdownOption[];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public roleService: RoleService,
    private snackBarService: SnackbarService,
    private router: Router
  ) {
    this.roleService.getRole().subscribe((res) => {
      this.roleOptions = res.data;
    });

    this.registrationForm = this.fb.group(
      {
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
        role: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(ValidationPatterns.PASSWORD),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    let mismatch = { mismatch: true };

    if(!confirmPassword.errors && password.value !== confirmPassword.value) {
      confirmPassword.setErrors(mismatch)
    }

    return password &&
      confirmPassword &&
      password.value !== confirmPassword.value
      ? mismatch
      : null;
  }

  getFormControl(controlName: string): FormControl {
    return this.registrationForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.authService
        .register(this.registrationForm.value as Register)
        .subscribe((res) => {
          if (res.success) {
            this.snackBarService.show(
              new SnackbarConfig({ message: 'User registered successfully.' })
            );
            this.router.navigateByUrl('admin/login');
          }
        });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
