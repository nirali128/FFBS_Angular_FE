import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/service/authentication.service';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, SelectComponent, ReactiveFormsModule, MatCardModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  errorMessages = {
    email: {
      required: 'Email is required',
      email: 'Enter a valid email address'
    },
    password: {
      required: 'Password is required'
    }
  };

  constructor(private fb: FormBuilder, public authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]], 
      rememberMe: [false] 
    });
  }

    getFormControl(controlName: string): FormControl {
      return this.loginForm.get(controlName) as FormControl;
    }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      this.authService.login(formValues);
    } else {
      console.log('Form is invalid!');
    }
  }
}
