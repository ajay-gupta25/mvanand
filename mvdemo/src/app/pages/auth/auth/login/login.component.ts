// src/app/login/login.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth.service';
import { environment } from '@env/environment';
import { GoogleAuthService } from '@services/auth/google-auth.service';
import { GoogleSheetsService } from '@services/google-sheet/google-sheets.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  public appName: string = environment.appName;
  private loggedIn = false;
  showPassword: boolean = false;

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private tokenKey = 'auth_token';
  rememberMe: boolean = false;

  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(
    private router: Router,
    private gAuthService: GoogleAuthService,
    private sheetsService: GoogleSheetsService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngAfterViewInit(): void {
    this.emailInput.nativeElement.focus();
    // this.gAuthService.login1();
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  login1() {
    // this.gAuthService.login1()
  }
  token() {
    // console.log(this.gAuthService.getToken);
  }
  excelsheet() {
    this.sheetsService.getSheetData('sheet1');
  }
  login(): void {
    this.gAuthService.login()
    // .then(() => {
    //   let permissions = {"isAdmin":false,"_id":"66b30ddee9a1e0a55dbca56a","name":"QA Test","permission":[{"Dashboard":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"User Management":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"Role Permission":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"Company Management":{"create":false,"update":true,"delete":true,"view":true,"importExport":true}},{"Organization Management":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"Manage Folder":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"Call Files":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"Application":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}},{"Category Template Management":{"create":true,"update":true,"delete":true,"view":true,"importExport":true,"all":true}}]};
    //   console.log('Login flow initiated successfully.', this.gAuthService.getToken);
    //   localStorage.setItem(this.tokenKey, this.gAuthService.getToken);
    //   // localStorage.setItem('loggedUserRoleId', response.data?.role_id);
    //   // localStorage.setItem('profileimage', JSON.stringify(response.data?.image));
    //   localStorage.setItem('permissions', JSON.stringify(permissions));
    //   // localStorage.setItem('loggedUserId', '670630a2ba4a4bf5a0cb0a64');
    //   // localStorage.setItem('firstName', response.data?.firstName);
    //   // localStorage.setItem('lastName', response.data?.lastName);
    //   // localStorage.setItem('email', response.data?.email);
    //   this.router.navigate(['/home/dashboard']);
    // })
    // .catch((error) => {
    //   console.error('An error occurred during login:', error);
    // });
    // const { email, password } = this.formGroup.value;
    // const credentials = { email, password };
    // this.authService.login(credentials).subscribe({
    //   next: (response) => {
    //     if (response && response.success === 1) {
    //       localStorage.setItem(this.tokenKey, response.data.token);
    //       localStorage.setItem('loggedUserRoleId', response.data?.role_id);
    //       localStorage.setItem('profileimage', JSON.stringify(response.data?.image));
    //       localStorage.setItem('permissions', JSON.stringify(response.data?.rolePermission));
    //       localStorage.setItem('loggedUserId', response.data?._id);
    //       localStorage.setItem('firstName', response.data?.firstName);
    //       localStorage.setItem('lastName', response.data?.lastName);
    //       localStorage.setItem('email', response.data?.email);
    //       this.router.navigate(['/home']);
    //     } else {
    //       this.toastr.error(response?.error || response?.error.error || 'An unknown error occurred' );
    //     }
    //   },
    //   error: (error) => {
    //     this.toastr.error(error.error?.error || error.error?.message  );
    //   }
    // });
  }
}
