import { HttpClient, HTTP_INTERCEPTORS,HttpClientModule }from '@angular/common/http';
import { APP_INITIALIZER,NgModule,Injector }from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule, DatePipe,HashLocationStrategy, LocationStrategy }from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateService,TranslateModule,TranslateLoader}from '@ngx-translate/core';
import { TranslateHttpLoader }  from '@ngx-translate/http-loader';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Internal modules
import { AppRoutingModule }     from './app-routing.module';
import { SharedModule }         from './shared/shared.module';
import { StaticModule }         from './static/static.module';

// Services
import { AppService }           from '@services/app.service';
import { StoreService }         from '@services/store.service';

// Components
import { AppComponent }         from './app.component';

// Factories
import { appInitFactory }       from '@factories/app-init.factory';
import { TagInputModule } from 'ngx-chips';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { OAuthModule } from 'angular-oauth2-oidc';
import { UserComponent } from './pages/modules/user/user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddUsersComponent } from './pages/modules/user/add-users/add-users.component';
import { ViewUsersComponent } from './pages/modules/user/view-users/view-users.component';




@NgModule({
  imports: [
    // Angular modules
    HttpClientModule,
    BrowserAnimationsModule,
    NgbTooltipModule,
    TagInputModule,
    OAuthModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserModule,
    NgxPaginationModule,
    NgbModule,

    // External modules
    TranslateModule.forRoot({
      loader :
      {
        provide    : TranslateLoader,
        useFactory : (createTranslateLoader),
        deps       : [HttpClient]
      }
    }),
    AngularSvgIconModule.forRoot(),

    // Internal modules
    SharedModule,
    StaticModule,
    AppRoutingModule,



    CommonModule,
    // UserRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    NgxPaginationModule,
  ],
  declarations: [
    AppComponent,
    UserComponent,
    AddUsersComponent,
    ViewUsersComponent
  ],
  providers: [
    // External modules
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide    : APP_INITIALIZER,
      useFactory : appInitFactory,
      deps       : [ TranslateService, Injector ],
      multi      : true
    },

    // Services
    AppService,
    StoreService,

    // Pipes
    DatePipe,

    // Guards

    // Interceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http : HttpClient)
{
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
