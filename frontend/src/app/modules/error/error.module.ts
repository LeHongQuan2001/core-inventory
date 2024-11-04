import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared-modules/shared.module";
import {ErrorRoutingModule} from "./error-routing.module";
import {FormsModule} from "@angular/forms";
import {ErrorAccessDeniedComponent} from "./components/access-denied/access-denied.component";
import {ErrorInternalErrorComponent} from "./components/internal-error/internal-error.component";
import {ErrorNotFoundComponent} from "./components/not-found/not-found.component";
import {ErrorBadRequestComponent} from './components/bad-request/bad-request.component';

@NgModule({
    declarations: [
        ErrorNotFoundComponent,
        ErrorInternalErrorComponent,
        ErrorAccessDeniedComponent,
        ErrorBadRequestComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ErrorRoutingModule
    ]
})
export class ErrorModule {
}
