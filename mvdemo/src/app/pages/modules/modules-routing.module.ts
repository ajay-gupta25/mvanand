import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth/auth.guard';
import { ModulesComponent } from './modules.component';
import { PermissionGuard } from '../../shared/auth/permissions.guard';
const routes : Routes = [
  {path:'',redirectTo:'dashboard',pathMatch:'full'},
  {path:'',component:ModulesComponent,
    canActivate:[AuthGuard],
    children:[
    {
      path         : 'dashboard',
      loadChildren : () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [AuthGuard,PermissionGuard],
      data: { modules: 'Dashboard', accessType: 'view' }
  
    },
    // {
    //   path         : 'companies',
    //   loadChildren : () => import('../modules/company/company.module').then(m => m.CompanyModule),
    //   // canActivate: [AuthGuard,PermissionGuard],
    //   data: { modules: 'Company Management', accessType: 'view' }
  
    // },
    // {
    //   path         : 'organizations',
    //   loadChildren : () => import('../modules/organization/organization.module').then(m => m.OrganizationModule),
    //   // canActivate: [AuthGuard,PermissionGuard],
    //   data: { modules: 'Organization Management', accessType: 'view' }

  
    // },
    {
      path         : 'userManagement',
      loadChildren : () => import('../modules/user/user.module').then(m => m.UserModule),
      canActivate: [AuthGuard,PermissionGuard],
      data: { modules: 'User Management', accessType: 'view' }

  
    },
    // {
    //   path         : 'roleManagement',
    //   loadChildren : () => import('../modules/role/role.module').then(m => m.RoleModule),
    //   // canActivate: [AuthGuard,PermissionGuard],
    //   data: { modules: 'Role Permission', accessType: 'view' }

  
    // },
    // {
    //   path         : 'folderManagement',
    //   loadChildren : () => import('../modules/folder/folder.module').then(m => m.FolderModule),
    //   // canActivate: [AuthGuard,PermissionGuard],
    //   data: { modules: 'Manage Folder', accessType: 'view' }
    // },
    // {
    //   path         : 'setting',
    //   loadChildren : () => import('../modules/setting/setting.module').then(m => m.SettingModule),
    //   // canActivate: [AuthGuard]
    // },
    // {
    //   path         : 'call-search',
    //   loadChildren : () => import('../modules/call/call.module').then(m => m.CallModule),
    //   // canActivate: [AuthGuard]
    // },
    // {
    //   path         : 'application',
    //   loadChildren : () => import('../modules/application/application.module').then(m => m.ApplicationModule),
    //   // canActivate: [AuthGuard]
    // },
    // {
    //   path         : 'category',
    //   loadChildren : () => import('../modules/category/category.module').then(m => m.CategoryModule),
    //   // canActivate: [AuthGuard]
    // },
  ]},
  
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
