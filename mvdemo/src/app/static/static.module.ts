// Angular modules
import { NgModule }            from '@angular/core';

// Internal modules
import { SharedModule }        from '../shared/shared.module';

// Components
import { StaticRoutingModule } from './static-routing.module';
import { NotFoundComponent }   from './not-found/not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

@NgModule({
  imports      :
  [
    SharedModule,
    StaticRoutingModule
  ],
  declarations :
  [
    NotFoundComponent,
    AccessDeniedComponent
  ]
})
export class StaticModule {}
