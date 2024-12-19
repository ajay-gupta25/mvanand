import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId = '494395922809-oa4h19stvej6gt8bvmjnv7ofoni7ap5i.apps.googleusercontent.com';
  private apiKey = 'AIzaSyA2mrYyZestnVjIjt4xHKTDrbfQjmPn0bU';
  private scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets';
  

  authConfig: AuthConfig = {
    // issuer: 'https://accounts.google.com',
    // strictDiscoveryDocumentValidation: false,
    // clientId: '494395922809-oa4h19stvej6gt8bvmjnv7ofoni7ap5i.apps.googleusercontent.com',
    // scope: 'openid profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
    // redirectUri: 'https://ajay-gupta25.github.io/mvanand/',
    // redirectUri: window.location.origin,
  }

  constructor(private oauthService: OAuthService) {
    // this.initClient();
    this.configure();
  }

  configure() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
  
  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  get getToken() {
    return this.oauthService.getAccessToken();
  }

  initClient(): void {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        scope: this.scopes,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      });
    });
  }

  signIn(): Observable<any> {
    return new Observable((observer) => {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.signIn().then(
        (user: any) => {
          observer.next(user);
          observer.complete();
        },
        (error: any) => observer.error(error)
      );
    });
  }

  signOut(): void {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
  }

  // isSignedIn(): boolean {
  //   return gapi.auth2.getAuthInstance().isSignedIn.get();
  // }

  getAccessToken(): string | null {
    return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  }
}
