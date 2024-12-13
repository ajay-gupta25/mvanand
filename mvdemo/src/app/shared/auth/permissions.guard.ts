import { CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionService } from 'src/app/shared/auth/permssion.guard';
import { RouteData } from './permssion.model';



@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private permissionService: PermissionService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const data = next.data as RouteData;
    
    let permission =  this.permissionService.hasPermission(data.modules, data.accessType)
      if (permission) {
        return true;
      } else {
        return this.router.createUrlTree(['/access-denied']);
      }

  }
}