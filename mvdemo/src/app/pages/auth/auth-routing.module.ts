// Angular modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Components
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { UserComponent } from '../modules/user/user.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        // redirectTo: 'login',
        component: UserComponent,
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,

      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,


      },
      {
        path: 'reset-password/:token',
        component: ResetPasswordComponent,

      },
    
      
    ]
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes),
      NgSelectModule
    ],
  exports:
    [
      RouterModule
    ],
  providers:
    [
    ]
})
export class AuthRoutingModule { }
