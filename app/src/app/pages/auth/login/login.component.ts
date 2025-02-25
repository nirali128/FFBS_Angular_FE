import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/service/authentication.service';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { CommonModule } from '@angular/common';
import { Login } from '../../../shared/interfaces/login';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../shared/constants/snackbar-config.const';
import { Router } from '@angular/router';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { SuccessMessages } from '../../../shared/constants/messages-const';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    CheckboxComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, public authService: AuthService, private snackBarService: SnackbarService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.loginForm.get(controlName) as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as Login).subscribe((res) => {
        if (res.success) {
          this.snackBarService.show(
            new SnackbarConfig({ message: SuccessMessages.USER_LOGIN_SUCCESS })
          );
          this.router.navigateByUrl('admin/dashboard');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}