// Angular modules
import { NgModule }     from '@angular/core';
import { Routes, RouterModule}       from '@angular/router';
import { AccessDeniedComponent } from '../static/access-denied/access-denied.component';

const routes : Routes = [
  // { path : '', component : NotFoundComponent },
  { path : 'access-denied', component : AccessDeniedComponent },
];

@NgModule({
  imports : [ RouterModule.forChild(routes) ],
  exports : [ RouterModule ]
})
export class StaticRoutingModule { }
