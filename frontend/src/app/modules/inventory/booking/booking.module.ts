import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../../shared-modules/shared.module";
import {BookingRoutingModule} from './booking-routing.module';
import {TranslateModule} from "@ngx-translate/core";
import {InventoryBookingDialogCreateComponent} from "./components/_dialogs/create/create.component";
import {InventoryBookingDialogCreateCpmComponent} from "./components/_dialogs/create-cpm/create-cpm.component";
import {InventoryBookingDialogUpdateComponent} from "./components/_dialogs/update/update.component";
import {InventoryBookingMyBookingComponent} from "./components/my-booking/my-booking.component";
import {InventoryBookingCalendarLocationOverviewComponent} from "./components/calendar-location/overview/overview.component";
import {InventoryBookingCalendarZoneOverviewComponent} from "./components/calendar-zone/overview/overview.component";

@NgModule({
    declarations: [
        InventoryBookingCalendarLocationOverviewComponent,
        InventoryBookingCalendarZoneOverviewComponent,
        InventoryBookingDialogCreateComponent,
        InventoryBookingDialogCreateCpmComponent,
        InventoryBookingDialogUpdateComponent,
        InventoryBookingMyBookingComponent
    ],
    imports: [
        CommonModule,
        BookingRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        EffectsModule.forFeature(),
        TranslateModule
    ]
})

export class BookingModule {
}
