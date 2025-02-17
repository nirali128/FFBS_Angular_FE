import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DropdownOption } from '../../../shared/interfaces/dropdown.options';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { MatCardModule } from '@angular/material/card'; 
import { AuthService } from '../../../shared/service/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputComponent, ButtonComponent, SelectComponent, ReactiveFormsModule, MatCardModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registrationForm: FormGroup;
  errorMessages = {
    firstName: {
      required: 'First name is required',
      pattern: 'Only alphabetic characters are allowed'
    },
    lastName: {
      required: 'Last name is required',
      pattern: 'Only alphabetic characters are allowed'
    },
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email'
    },
    phoneNumber: {
      required: 'Phone number is required',
      pattern: 'Enter a valid phone number'
    },
    role: {
      required: 'Role is required'
    },
    password: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters long',
      pattern: 'Password must contain at least one number'
    },
    confirmPassword: {
      required: 'Confirm password is required',
      mismatch: 'Passwords do not match'
    }
  };

  roleOptions: DropdownOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'customer', label: 'Customer' },
  ];

  constructor(private fb: FormBuilder, public authService: AuthService) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,4}[-\\s]?\\(?\\d{1,4}\\)?[-\\s]?\\d{1,4}[-\\s]?\\d{1,4}$')]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('.*[0-9].*')]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { 'mismatch': true }
      : null;
  }

  getFormControl(controlName: string): FormControl {
    return this.registrationForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.authService.register(this.registrationForm.value);
    } else {
      this.registrationForm.markAllAsTouched()
    }
  }
}
