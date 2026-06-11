import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse } from '../../models/user';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  phoneForm: FormGroup;
  otpForm: FormGroup;
  authMethod: 'email' | 'otp' = 'otp';
  isLoading = false;
  otpSent = false;
  errorMessage = '';
  successMessage = '';
  enteredPhone = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(?:\+91)?\d{10}$/)]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get phone() {
    return this.phoneForm.get('phone');
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  setAuthMethod(method: 'email' | 'otp'): void {
    this.authMethod = method;
    this.errorMessage = '';
    this.successMessage = '';
    this.otpSent = false;
  }

  onSubmitEmail(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password.';
      },
    });
  }

  onSendOtp(): void {
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const phoneNumber = this.phoneForm.value.phone;

    this.authService.sendOtp(phoneNumber).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.otpSent = true;
        this.enteredPhone = phoneNumber;
        this.successMessage = res.message || 'OTP sent successfully!';
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP.';
      },
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const otpCode = this.otpForm.value.otp;

    this.authService.verifyOtp(this.enteredPhone, otpCode).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid OTP or Verification failed.';
      },
    });
  }

  resetOtpState(): void {
    this.otpSent = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.otpForm.reset();
  }
}
