// Angular modules
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// Internal modules
import { environment } from '@env/environment';

import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@services/store.service';
import { GoogleAuthService } from '@services/auth/google-auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss']
})
export class LayoutHeaderComponent implements OnInit {
  @Input() profileImage: string;
  public appName: string = environment.appName;
  public isMenuCollapsed: boolean = true;
  sidebarFlag: boolean = false;
  
  ImgUrl: string = null;
  firstName: string = null;
  @Input() firstName1: string | null = null;
  lastName: string = null;
  email: string = null;
  isLoggedIn: any;
  isLoading: boolean = false;

  @Output() messageEvent = new EventEmitter<string>();
  selectedLanguage: any = "English";
  constructor
    (
      public translate: TranslateService,
      private router: Router,
      public gAuthService: GoogleAuthService,
      private storeService: StoreService
    ) {
    }

    toggleLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'English' ? 'Gujarati' : 'English';
      this.messageEvent.emit(this.selectedLanguage);
    }
  
    setLanguage(language: string) {
      this.selectedLanguage = language;
      this.messageEvent.emit(this.selectedLanguage);
    }


    
    public ngOnInit(): void {
      this.firstName1 = "aajjjj";
    this.ImgUrl = this.profileImage;
    
    //  this.updateProfileImage();
     this.storeService.watchStorage().subscribe((key: string) => {
      if (key) {
        this.ImgUrl = this.storeService.getItem('profileimage');
      }
    })
    setTimeout(() => {
      // this.translate1();
    }, 5000);

    if (localStorage.getItem('sidebarFlag')) {
      this.sidebarFlag = JSON.parse(localStorage.getItem('sidebarFlag'));
    }

    this.gAuthService.isLoggedIn$.subscribe(
      (loggedIn) => (this.isLoggedIn = loggedIn)
    );

    // Subscribe to user profile
    this.gAuthService.userProfile$.subscribe(
      (profile) => {
        this.firstName = this.storeService.getItem('firstName');
        this.lastName = this.storeService.getItem('lastName');
        this.email = this.storeService.getItem('email');
        this.updateProfileImage();
        this.isLoading = false;
      }
    );
  }

  // ngOnInit(): void {
  //   // Subscribe to login state
  //   this.authStateService.isLoggedIn$.subscribe(
  //     (loggedIn) => (this.isLoggedIn = loggedIn)
  //   );

  //   // Subscribe to user profile
  //   this.authStateService.userProfile$.subscribe(
  //     (profile) => (this.user = profile)
  //   );
  // }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickLogout(): Promise<void> {
    this.gAuthService.logout();
    localStorage.clear();
    // this.router.navigate(['/login']);
  }

  login() {
    this.isLoading = true;
    this.gAuthService.login();
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);
    // this.gAuthService.checkLogin();
  }

  opensidebar() {
    this.sidebarFlag = true;
    localStorage.setItem('sidebarFlag', JSON.stringify(true));
    $('.site_container').addClass('show_sidebar');
  }

  closesidebar() {
    this.sidebarFlag = false;
    localStorage.setItem('sidebarFlag', JSON.stringify(false));
    $('.site_container').removeClass('show_sidebar');
  }

  translate1() {
    let data = this.translate.instant('MY_ACCOUNT')
  }

  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private updateProfileImage() {
    const profileImageString = this.storeService.getItem('profileimage');
    // console.log('profile  strin: ', profileImageString);
    if (profileImageString && profileImageString !== "undefined") {
      this.ImgUrl = profileImageString;
    }
  }
}
