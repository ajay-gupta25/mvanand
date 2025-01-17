// Angular modules
import { CommonModule }               from '@angular/common';
import { NgModule }                   from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule }               from '@angular/router';

// External modules
import { TranslateModule }            from '@ngx-translate/core';
import { AngularSvgIconModule }       from 'angular-svg-icon';
import { NgbModule }                  from '@ng-bootstrap/ng-bootstrap';

// Components
import { ToastComponent }             from './components/blocks/toast/toast.component';
import { ProgressBarComponent }       from './components/blocks/progress-bar/progress-bar.component';

// Forms
import { FormConfirmComponent }      from './components/forms/form-confirm/form-confirm.component';

// Modals
import { ModalWrapperComponent }     from './components/modals/modal-wrapper/modal-wrapper.component';

// Layouts
import { LayoutHeaderComponent }     from './components/layouts/layout-header/layout-header.component';
import { PageLayoutComponent }       from './components/layouts/page-layout/page-layout.component';

// Pipes

// Directives
import { ModalWrapperDirective }     from './directives/modal-wrapper.directive';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutFooterComponent } from './components/layouts/layout-footer/layout-footer.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HighlightPipe } from './pipe/highlight.pipe';


@NgModule({
  imports         :
  [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // External modules
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,
  ],
  declarations    :
  [
    // Components
    ToastComponent,
    ProgressBarComponent,

    // Forms
    FormConfirmComponent,

    // Modals
    ModalWrapperComponent,

    // Layouts
    LayoutHeaderComponent,
    PageLayoutComponent,

    // Pipes
    HighlightPipe,
    // Directives
    ModalWrapperDirective,
      SidebarComponent,
      LayoutFooterComponent,
      SettingsComponent,
      HighlightPipe
  ],
  exports         :
  [
    // Angular modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // External modules
    TranslateModule,
    AngularSvgIconModule,
    NgbModule,

    // Components
    ToastComponent,
    ProgressBarComponent,

    // Forms
    FormConfirmComponent,

    // Modals
    ModalWrapperComponent,

    // Layouts
    LayoutHeaderComponent,
    PageLayoutComponent,

    // Pipes
      HighlightPipe,

    // Directives
    ModalWrapperDirective,
    LayoutFooterComponent,
    SidebarComponent,
    SettingsComponent
  ],
  providers       :
  [
  ]
})
export class SharedModule {}
