import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {ErrorNotFoundComponent} from "./components/not-found/not-found.component";
import {ErrorAccessDeniedComponent} from "./components/access-denied/access-denied.component";
import {ErrorInternalErrorComponent} from "./components/internal-error/internal-error.component";
import {ErrorBadRequestComponent} from "./components/bad-request/bad-request.component";

const routes: Routes = [
    { path: '400.html', component: ErrorBadRequestComponent },
    { path: '401.html', component: ErrorNotFoundComponent },
    { path: '403.html', component: ErrorAccessDeniedComponent },
    { path: '404.html', component: ErrorNotFoundComponent },
    { path: '500.html', component: ErrorInternalErrorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorRoutingModule {
}
