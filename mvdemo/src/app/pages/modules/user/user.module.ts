import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { SharedModule }      from '../../../shared/shared.module'
import {UserRoutingModule}  from './user-routing.module'
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    // UserComponent,
    // AddUsersComponent,
    // ViewUsersComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class UserModule { }
