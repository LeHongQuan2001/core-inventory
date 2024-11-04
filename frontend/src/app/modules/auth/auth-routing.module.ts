import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthLoginComponent } from "./components/login/login.component";
import {AuthGuard} from "../../guards/auth.guard";
import {AuthSocialCallbackComponent} from "./components/social/callback/callback.component";

const routes: Routes = [
    { path: 'login', component: AuthLoginComponent, title: 'modules.auth.login.title' },
    { path: 'error', component: AuthLoginComponent, title: 'modules.error.common.title' },
    { path: 'logout', component: AuthLoginComponent, canActivate: [AuthGuard] },
    {
        path: 'auth/:socialName/callback',
        component: AuthSocialCallbackComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
