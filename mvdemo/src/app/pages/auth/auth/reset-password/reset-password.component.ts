import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute ,Params} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';

// Services
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  showPassword: boolean = false;
  formGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/)]),
    conPassword: new FormControl('',[Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/)])
  });

  private tokenFromUrl: string = '';

  constructor
    (
      public router: Router,
      private authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private toastr: ToastrService
    ) {
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.tokenFromUrl = params['token'];
      if (!environment.production)
        console.log('reser password-> Token : ', this.tokenFromUrl);
    });
  }
  resetPassword(): void {
    const { newPassword, conPassword } = this.formGroup.controls;

    if (!newPassword.value.trim() || !conPassword.value.trim() || newPassword.value !== conPassword.value) {
      if (!newPassword.value.trim()) {
        this.toastr.error('Please enter password' );
      } else if (!conPassword.value.trim()) {
        this.toastr.error('Please enter confirm password' );
      } else {
        this.toastr.error('Passwords do not match' );
      }
      return;
    }

    this.authService.resetPassword(this.tokenFromUrl, newPassword.value, conPassword.value).subscribe({
      next: (res) => {
        if (res.success === 1) {
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(res.error );
        }
      },
      error: (error) => {
        this.toastr.error(error.error.error );
      }
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

