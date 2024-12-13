import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
    userPermissions:any;
  
    constructor() {
      this.userPermissions = [];
    }
  
    hasPermission(module: string, action: string): boolean {
        this.userPermissions = JSON.parse(localStorage.getItem('permissions'));
      for (const permission of this.userPermissions?.permission) {
        if (permission.hasOwnProperty(module)) {
          return permission[module][action];
        }
      }
      return false;
    }
  }