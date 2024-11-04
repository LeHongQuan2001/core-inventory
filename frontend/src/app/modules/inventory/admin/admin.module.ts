import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EffectsModule} from '@ngrx/effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../../shared-modules/shared.module";
import {AdminRoutingModule} from './admin-routing.module';
import {InventoryAdminUserListComponent} from './components/user/list/list.component';
import {TranslateModule} from "@ngx-translate/core";
import {InventoryAdminUserDialogCreateComponent} from "./components/user/_dialogs/create/create.component";
import {InventoryAdminUserDialogUpdateComponent} from "./components/user/_dialogs/update/update.component";
import {InventoryAdminBookingListComponent} from "./components/booking/list/list.component";
import {InventoryAdminBookingDialogUpdateComponent} from "./components/booking/_dialogs/update/update.component";
import {InventoryAdminBookingDialogCancelComponent} from "./components/booking/_dialogs/cancel/cancel.component";
import {InventoryAdminWebsiteListComponent} from "./components/website/list/list.component";
import {
    InventoryAdminBookingDialogUpdateMultiComponent
} from "./components/booking/_dialogs/update-multi/update-multi.component";
import {
    InventoryAdminWebsiteGroupDialogCreateComponent
} from "./components/website-group/_dialogs/create/create.component";
import {
    InventoryAdminWebsiteGroupDialogUpdateComponent
} from "./components/website-group/_dialogs/update/update.component";

import {InventoryAdminWebsiteDialogCreateComponent} from "./components/website/_dialogs/create/create.component";
import {InventoryAdminWebsiteDialogUpdateComponent} from "./components/website/_dialogs/update/update.component";
import {InventoryAdminChannelDialogCreateComponent} from "./components/channel/_dialogs/create/create.component";
import {InventoryAdminChannelListComponent} from "./components/channel/list/list.component";
import {InventoryAdminChannelDialogUpdateComponent} from "./components/channel/_dialogs/update/update.component";
import {InventoryAdminBannerListComponent} from "./components/banner/list/list.component";
import {InventoryAdminBannerDialogCreateComponent} from "./components/banner/_dialogs/create/create.component";
import {InventoryAdminBannerDialogUpdateComponent} from "./components/banner/_dialogs/update/update.component";
import {InventoryAdminBundleListComponent} from "./components/bundle/list/list.component";
import {InventoryAdminLocationListComponent} from "./components/location/list/list.component";
import {InventoryAdminLocationDialogCreateComponent} from "./components/location/_dialogs/create/create.component";
import {InventoryAdminLocationDialogUpdateComponent} from "./components/location/_dialogs/update/update.component";
import {InventoryAdminZoneListComponent} from "./components/zone/list/list.component";
import {InventoryAdminZoneDialogCreateComponent} from "./components/zone/_dialogs/create/create.component";
import {InventoryAdminZoneDialogUpdateComponent} from "./components/zone/_dialogs/update/update.component";
import {InventoryAdminBundleDialogCreateComponent} from "./components/bundle/_dialogs/create/create.component";
import {InventoryAdminBundleDialogUpdateComponent} from "./components/bundle/_dialogs/update/update.component";
import {InventoryAdminWebsiteGroupListComponent} from "./components/website-group/list/list.component";


@NgModule({
    declarations: [
        // User
        InventoryAdminUserListComponent,
        InventoryAdminUserDialogCreateComponent,
        InventoryAdminUserDialogUpdateComponent,
        // Booking
        InventoryAdminBookingListComponent,
        InventoryAdminBookingDialogCancelComponent,
        InventoryAdminBookingDialogUpdateComponent,
        InventoryAdminBookingDialogUpdateMultiComponent,
        // Website booking
        InventoryAdminWebsiteListComponent,
        InventoryAdminWebsiteDialogCreateComponent,
        InventoryAdminWebsiteDialogUpdateComponent,
        // Channel booking
        InventoryAdminChannelListComponent,
        InventoryAdminChannelDialogCreateComponent,
        InventoryAdminChannelDialogUpdateComponent,
        // Banner booking
        InventoryAdminBannerListComponent,
        InventoryAdminBannerDialogCreateComponent,
        InventoryAdminBannerDialogUpdateComponent,
        // Bundle booking
        InventoryAdminBundleListComponent,
        InventoryAdminBundleDialogCreateComponent,
        InventoryAdminBundleDialogUpdateComponent,
        // Location booking
        InventoryAdminLocationListComponent,
        InventoryAdminLocationDialogCreateComponent,
        InventoryAdminLocationDialogUpdateComponent,
        // Zone booking
        InventoryAdminZoneListComponent,
        InventoryAdminZoneDialogCreateComponent,
        InventoryAdminZoneDialogUpdateComponent,
        // Website group booking
        InventoryAdminWebsiteGroupListComponent,
        InventoryAdminWebsiteGroupDialogCreateComponent,
        InventoryAdminWebsiteGroupDialogUpdateComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        EffectsModule.forFeature(),
        TranslateModule
    ]
})

export class AdminModule {
}
