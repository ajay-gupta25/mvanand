// Angular modules
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


// Services
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  isSubmitted:boolean;
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor
    (
      public router: Router,
      private authService: AuthService,
      private toastr: ToastrService
    ) {
  }

  forgotPassword(): void {
    this.authService.forgotPassword(this.formGroup.controls.email.getRawValue()).subscribe({
      next: (res) => {
        if (res.success === 1) {
          this.toastr.success(res.message, 'Success');
          this.isSubmitted = true; 
        } else {
          this.toastr.error(res.error );
        }
      },
      error: (error) => {
        this.toastr.error(error.error?.error || error.error?.message  );
      }
    });
  }

  resendResetLink(): void {
    this.authService.resendResetLink(this.formGroup.controls.email.getRawValue()).subscribe({
      next: (res) => {
        if (res.success === 1) {
          this.toastr.success(res.message, 'Success');
        } else {
          this.toastr.error(res.error );
        }
      },
      error: (error) => {
        this.toastr.error(error.error?.error || error.error.message );
      }
    });
  }

}
