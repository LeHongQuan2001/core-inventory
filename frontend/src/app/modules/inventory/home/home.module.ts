import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../../shared-modules/shared.module";
import {HomeRoutingModule} from './home-routing.module';
import {InventoryHomeDashboardComponent} from './components/dashboard/dashboard.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        // Home
        InventoryHomeDashboardComponent,
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        EffectsModule.forFeature(),
        TranslateModule
    ]
})

export class HomeModule {
}
