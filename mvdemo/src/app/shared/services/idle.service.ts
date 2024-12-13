import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTime = 0;
  private idleThreshold = 10 * 60 * 1000; // 15 minutes
  private interval;

  constructor(private router: Router, private ngZone: NgZone, private authService: AuthService) {
    // this.startWatching();
    // this.resetIdleTimer();
  }

  startWatching() {
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.checkIdleTime();
      }, 1000);

      // window.addEventListener('mousemove', () => this.resetIdleTimer());
      window.addEventListener('keydown', () => this.resetIdleTimer());
      window.addEventListener('click', () => this.resetIdleTimer());
    });
  }

  resetIdleTimer() {
    this.idleTime = 0;
  }

  checkIdleTime() {
    this.idleTime += 1000;
    if (this.idleTime >= this.idleThreshold) {
      this.ngZone.run(() => this.authService.logout());
    }
  }
}
