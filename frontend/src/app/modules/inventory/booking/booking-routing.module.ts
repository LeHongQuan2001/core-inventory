import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../../guards/auth.guard";
import {
    InventoryBookingCalendarLocationOverviewComponent
} from "./components/calendar-location/overview/overview.component";
import {InventoryBookingMyBookingComponent} from "./components/my-booking/my-booking.component";
import {InventoryBookingCalendarZoneOverviewComponent} from "./components/calendar-zone/overview/overview.component";

const routes: Routes = [
    {
        path: 'calendar/location/overview',
        component: InventoryBookingCalendarLocationOverviewComponent,
        title: 'modules.inventory.booking.common.calendarLocation',
        canActivate: [AuthGuard]
    },
    {
        path: 'calendar/zone/overview',
        component: InventoryBookingCalendarZoneOverviewComponent,
        title: 'modules.inventory.booking.common.calendarZone',
        canActivate: [AuthGuard]
    },
    {
        path: 'my-booking',
        component: InventoryBookingMyBookingComponent,
        title: 'modules.inventory.booking.myBooking',
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingRoutingModule {
}
