import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient,private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-in`, credentials);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, { newPassword, confirmPassword });
  }

  resendResetLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-password`, { email });
  }

  refreshToken(){
    const refreshToken = localStorage.getItem('auth_token');
    return this.http.post(`${this.apiUrl}/refresh-token`, {expiryToken:`${refreshToken}`})
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    // Perform additional logout operations, e.g., navigating to the login page
  }
}
