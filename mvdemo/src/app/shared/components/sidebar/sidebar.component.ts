import { Component } from '@angular/core';

import * as $ from 'jquery';
import { PermissionService } from '../../auth/permssion.guard';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  openSubMenus: string[] = []; // Array to store open submenus
  currentUrl: string;
  routePaths: string[] = [
    '/home/userManagement',
    '/home/companies',
    '/home/organizations',
    '/home/folderManagement',
    '/home/roleManagement',
    '/home/roleManagement/roleList',
    '/home/application',
    '/home/category'
  ];

  public appName: string = environment.appName;
  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.currentUrl = this.router.url; // Initialize currentUrl with the current URL when page reload
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }



  hasPermission(modules, accestype): boolean {
    return this.permissionService.hasPermission(modules, accestype);
  }
  toggleSubMenu(subMenuName: string) {
    const index = this.openSubMenus.indexOf(subMenuName);
    if (index > -1) {
      this.openSubMenus.splice(index, 1); // Remove from open submenus
    } else {
      this.openSubMenus.push(subMenuName); // Add to open submenus
    }
  }

  openSubmenu(id: any) {
    const menu = '#' + id

    if ($(menu).hasClass('open_submenu')) {
      $(menu).removeClass('open_submenu')
    } else {
      $('.has_submenu').removeClass('open_submenu');
      $(menu).toggleClass('open_submenu');
    }
  }

}
