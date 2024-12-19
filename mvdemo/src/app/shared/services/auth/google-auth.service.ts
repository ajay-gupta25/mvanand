import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, filter } from 'rxjs';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId = '494395922809-oa4h19stvej6gt8bvmjnv7ofoni7ap5i.apps.googleusercontent.com';
  private apiKey = 'AIzaSyA2mrYyZestnVjIjt4xHKTDrbfQjmPn0bU';
  private scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets';
  

  authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    strictDiscoveryDocumentValidation: false,
    clientId: '494395922809-oa4h19stvej6gt8bvmjnv7ofoni7ap5i.apps.googleusercontent.com',
    responseType: 'token id_token',
    // scope: 'openid profile email',
    showDebugInformation: true,
    scope: 'openid profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
    redirectUri: 'https://ajay-gupta25.github.io/mvanand/', // Working server
    // redirectUri: window.location.origin, // Working local
  }

  // private userLoggedIn = new BehaviorSubject<boolean>(false);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userProfileSubject = new BehaviorSubject<any>(null);

    // Observables to subscribe from other parts of the app
    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    userProfile$ = this.userProfileSubject.asObservable();

  constructor(private oauthService: OAuthService) {
    // this.initClient();
    // this.configure();
    this.configureOAuth();

  }

  // Configures the OAuthService
  private configureOAuth(): void {
    if (!this.getToken) {
      this.oauthService.configure(this.authConfig);
    }
    // this.oauthService.setStorage(localStorage);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const profileData = this.identityClaims;
        const permissions = {
          isAdmin: false,
          _id: "66b30ddee9a1e0a55dbca56a",
          name: "QA Test",
          permission: [
            {
              Dashboard: {
                create: true,
                update: true,
                delete: true,
                view: true,
                importExport: true,
                all: true,
              },
            },
            // Other permissions
          ],
        };
  
        localStorage.setItem('auth_token', this.getToken);
        localStorage.setItem('permissions', JSON.stringify(permissions));
        localStorage.setItem('profileimage', profileData['picture']);
        localStorage.setItem('firstName', profileData['given_name']);
        localStorage.setItem('lastName', profileData['family_name']);
        localStorage.setItem('email', profileData['email']);
      // Update shared state
      this.setLoggedInState(true);
      this.setUserProfile(true);
      } else {
        console.log('User Not loggedIn!!');
      }
    });
  }

  ngOnInit(): void {
    this.oauthService.events
    .pipe(filter((event) => event.type === 'token_received'))
    .subscribe(() => {
      const token = this.oauthService.getAccessToken();
      localStorage.setItem('auth_token', token);
      // console.log('Token received:', token);
    });
  }

  // Update login state
  setLoggedInState(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  // Update user profile
  setUserProfile(profile: any): void {
    this.userProfileSubject.next(profile);
  }


  login() {
    this.oauthService.initLoginFlow();
  }
  

  logout() {
    this.oauthService.logOut();
    this.setLoggedInState(false);
    this.setUserProfile(false);
  }

  // Get user information
  getUserInfo(): any {
    return this.oauthService.getIdentityClaims();
  }

  get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  get getToken() {
    return this.oauthService.getAccessToken();
  }


}
