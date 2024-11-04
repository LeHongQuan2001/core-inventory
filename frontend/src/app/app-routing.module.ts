import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutAuth} from "./layouts/auth/auth.component";
import {LayoutDefaultComponent} from "./layouts/default/default.component";
import {CustomPreloadingStrategyService} from "./services/custom-preloading.service";
import {LayoutErrorComponent} from "./layouts/error/error.component";
import {environment} from "../environments/environment";
import {AuthGuard} from "./guards/auth.guard";
import {BookingModule} from "./modules/inventory/booking/booking.module";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: LayoutAuth,
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
        data: { preload: false }
    },
    {
        path: '',
        component: LayoutDefaultComponent,
        title: 'common.name',
        loadChildren: () => import('./modules/inventory/home/home.module').then(m => m.HomeModule),
        data: { preload: true }
    },
    // {
    //     path: 'report',
    //     component: LayoutDefaultComponent,
    //     title: 'common.name',
    //     loadChildren: () => import('./modules/cdp/activation/activation.module').then(m => m.ActivationModule),
    //     data: { preload: true }
    // },
    {
        path: 'booking',
        component: LayoutDefaultComponent,
        title: 'common.name',
        loadChildren: () => import('./modules/inventory/booking/booking.module').then(m => m.BookingModule),
        data: { preload: true }
    },
    // {
    //     path: 'estimate',
    //     component: LayoutDefaultComponent,
    //     title: 'common.name',
    //     loadChildren: () => import('./modules/cdp/segment/segment.module').then(m => m.SegmentModule),
    //     data: { preload: true }
    // },
    
   
   
    {
        path: 'admin',
        component: LayoutDefaultComponent,
        title: 'common.name',
        loadChildren: () => import('./modules/inventory/admin/admin.module').then(m => m.AdminModule),
        data: { preload: true }
    },
    {
        path: environment.administratorPrefix,
        component: LayoutDefaultComponent,
        title: 'modules.admin.common.name',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        data: { preload: false },
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard]
    },
    {
        path: 'error',
        component: LayoutErrorComponent,
        title: 'modules.error.common.title',
        loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule),
        data: { preload: false }
    },
    /**
     * Page 404
     */
     { path: '**', redirectTo: 'error/404.html' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        onSameUrlNavigation: 'reload',
        preloadingStrategy: CustomPreloadingStrategyService,
        //@ts-ignore
        relativeLinkResolution: 'legacy'
    })],
    exports: [
        RouterModule
    ],
    providers: [
        CustomPreloadingStrategyService
    ]
})
export class AppRoutingModule {
}
