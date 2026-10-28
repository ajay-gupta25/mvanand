import { Component, Input } from '@angular/core';
import { PermissionService } from '../../auth/permssion.guard';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false
})
export class SettingsComponent {
  @Input() show_setting:boolean = true;

  constructor
  (
    private permissionService: PermissionService
  ) {

}


hasPermission(modules,accestype): boolean {
  return this.permissionService.hasPermission(modules,accestype);
}
}
