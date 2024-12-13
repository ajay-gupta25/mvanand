import { Component } from '@angular/core';
import { PermissionService } from 'src/app/shared/auth/permssion.guard';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent {

  constructor(
    private permissionService: PermissionService,
    // private router: Router
  ) {

  }

  hasPermission(modules, accestype): boolean {
    return this.permissionService.hasPermission(modules, accestype);
  }
}
