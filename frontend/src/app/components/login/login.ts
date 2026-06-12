import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, Navbar],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  phoneForm: FormGroup;
  isLoading = false;
  errorMsg = '';
  successMsg = '';

  loginMode: 'email' | 'otp' = 'email';
  otpSent = false;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get phone() { return this.phoneForm.get('phone'); }
  get otp() { return this.phoneForm.get('otp'); }

  setMode(mode: 'email' | 'otp') {
    this.loginMode = mode;
    this.errorMsg = '';
    this.successMsg = '';
    this.otpSent = false;
    this.phoneForm.reset();
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        const user = this.authService.getCurrentUser();
        this.router.navigate([user?.role === 'ADMIN' ? '/admin' : '/home']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }

  sendOtp() {
    if (this.phone?.invalid) {
      this.phone.markAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';
    const phoneVal = this.phone?.value;
    this.authService.sendOtp(phoneVal).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.otpSent = true;
        this.successMsg = res.message || 'OTP sent successfully! Check backend console.';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Failed to send OTP.';
      }
    });
  }

  verifyOtp() {
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';
    const { phone, otp } = this.phoneForm.value;
    this.authService.verifyOtp(phone, otp).subscribe({
      next: () => {
        this.isLoading = false;
        const user = this.authService.getCurrentUser();
        this.router.navigate([user?.role === 'ADMIN' ? '/admin' : '/home']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }
}
