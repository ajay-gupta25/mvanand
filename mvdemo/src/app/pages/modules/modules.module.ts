import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StaticModule } from 'src/app/static/static.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ModulesComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule,
    StaticModule,
    TranslateModule
  ]
})
export class ModulesModule { }
