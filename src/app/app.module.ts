import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
// ag-grid
import { AgGridAngular } from "@ag-grid-community/angular";
// application
import { AppComponent } from "./app.component";
// rich grid
import { RichGridComponent } from "./rich-grid-example/rich-grid.component";
import { DateComponent } from "./date-component/date.component";
import { SortableHeaderComponent } from "./header-component/sortable-header.component";
import { HeaderGroupComponent } from "./header-group-component/header-group.component";
import { RendererComponent } from './renderer-component/renderer.component';
import {ProficiencyFilter} from "./filters/proficiency.component.filter";
import {SkillFilter} from "./filters/skill.component.filter";
import { HttpClientModule } from "@angular/common/http";
import { OAuthModule } from "angular-oauth2-oidc";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        OAuthModule.forRoot(),
        AgGridAngular
    ],
    declarations: [
        AppComponent,
        RichGridComponent,
        DateComponent,
        SortableHeaderComponent,
        HeaderGroupComponent,
        RendererComponent,
        ProficiencyFilter,
        SkillFilter
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
