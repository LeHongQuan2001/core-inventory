import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthLoginComponent} from './components/login/login.component';
import {AuthRoutingModule} from "./auth-routing.module";
import {EffectsModule} from '@ngrx/effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../shared-modules/shared.module";
import {AuthSocialCallbackComponent} from './components/social/callback/callback.component';
import {OnlyNumberDirective} from "../../directives/only-number.directive";

@NgModule({
    declarations: [
        AuthLoginComponent,
        AuthSocialCallbackComponent,
        OnlyNumberDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        EffectsModule.forFeature(),
        AuthRoutingModule
    ],
    exports: [OnlyNumberDirective]
})

export class AuthModule {
}
