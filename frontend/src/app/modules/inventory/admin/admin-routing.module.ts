import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/guards/auth.guard';
import {InventoryAdminUserListComponent} from "./components/user/list/list.component";
import {InventoryAdminBookingListComponent} from "./components/booking/list/list.component";
import {InventoryAdminWebsiteListComponent} from "./components/website/list/list.component";
import {InventoryAdminChannelListComponent} from "./components/channel/list/list.component";
import {InventoryAdminBannerListComponent} from "./components/banner/list/list.component";
import {InventoryAdminBundleListComponent} from "./components/bundle/list/list.component";
import {InventoryAdminLocationListComponent} from "./components/location/list/list.component";
import {InventoryAdminZoneListComponent} from "./components/zone/list/list.component";
import {InventoryAdminWebsiteGroupListComponent} from "./components/website-group/list/list.component";

const routes: Routes = [
    {
        path: 'user/list',
        component: InventoryAdminUserListComponent,
        title: 'modules.inventory.admin.listUser',
        canActivate: [AuthGuard]
    },
    {
        path: 'booking/list',
        component: InventoryAdminBookingListComponent,
        title: 'modules.inventory.admin.listBooking',
        canActivate: [AuthGuard]
    },
    {
        path: 'website/list',
        component: InventoryAdminWebsiteListComponent,
        title: 'modules.inventory.admin.listWebsite',
        canActivate: [AuthGuard]
    },
    {
        path: 'channel/list',
        component: InventoryAdminChannelListComponent,
        title: 'modules.inventory.admin.listChannel',
        canActivate: [AuthGuard]
    },
    {
        path: 'banner/list',
        component: InventoryAdminBannerListComponent,
        title: 'modules.inventory.admin.listBanner',
        canActivate: [AuthGuard]
    },
    {
        path: 'bundle/list',
        component: InventoryAdminBundleListComponent,
        title: 'modules.inventory.admin.listBundle',
        canActivate: [AuthGuard]
    },
    {
        path: 'location/list',
        component: InventoryAdminLocationListComponent,
        title: 'modules.inventory.admin.listLocation',
        canActivate: [AuthGuard]
    },
    {
        path: 'zone/list',
        component: InventoryAdminZoneListComponent,
        title: 'modules.inventory.admin.listZone',
        canActivate: [AuthGuard]
    },
    {
        path: 'website-group/list',
        component: InventoryAdminWebsiteGroupListComponent,
        title: 'modules.inventory.admin.listWebsiteGroup',
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule {
}
