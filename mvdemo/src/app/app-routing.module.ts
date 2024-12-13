import { NgModule }from '@angular/core';
import { Routes,RouterModule }from '@angular/router';
import { NotFoundComponent } from './static/not-found/not-found.component';
const routes : Routes = [
  {
    path         : '',
    loadChildren : () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path         : 'home',
    loadChildren : () => import('./pages/modules/modules.module').then(m => m.ModulesModule),
  },
  { path : '',   redirectTo : '/auth/login', pathMatch : 'full' },
  { path : '**', redirectTo : '/home/userManagement' }
];

@NgModule({
  imports : [RouterModule.forRoot(routes,{ useHash: true })],
  exports : [RouterModule]
})
export class AppRoutingModule { }
