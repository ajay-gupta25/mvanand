
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth/auth.guard';

@Injectable({
providedIn: 'root',
})
export class IsLoginGuard implements CanActivate {
constructor(private router: Router,) {}

canActivate(): boolean {
if (AuthGuard) {
    this.router.navigate(['/home']);
return false;
} else {
return true;
}
}
}















