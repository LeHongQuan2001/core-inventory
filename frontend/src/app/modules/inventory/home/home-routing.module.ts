import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/guards/auth.guard';
import {InventoryHomeDashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
    {
        path: 'home',
        component: InventoryHomeDashboardComponent,
        title: 'modules.dmp.common.home',
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HomeRoutingModule {
}
