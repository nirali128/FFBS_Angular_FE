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
import { passwordMatchValidator } from '../../../shared/validators/custom.validator';
import { SuccessMessages } from '../../../shared/constants/messages-const';
import { ApiResponse } from '../../../shared/interfaces/api.response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registrationForm: FormGroup;

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
        role: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(ValidationPatterns.PASSWORD),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: passwordMatchValidator }
    );
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
              new SnackbarConfig({ message: SuccessMessages.USER_REGISTRATION_SUCCESS })
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
    if (ValidationPatterns.PHONE.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }  
}
