import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminUserListComponent } from "./components/user/list/list.component";
import { AdminRoleListComponent } from "./components/role/list/list.component";
import { AdminRouteListComponent } from "./components/route/list/list.component";
import { AuthGuard } from "../../guards/auth.guard";
import { SuperAdminGuard } from "../../guards/super.admin.guard";
import {AdminGuard} from "../../guards/admin.guard";
import {AdminActionLogListComponent} from "./components/action-log/list/list.component";
import {AdminDmpUserComponent} from "./components/dmp/user/user.component";

const routes: Routes = [
    //{ path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'role/search', component: AdminRoleListComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: 'user/search', component: AdminUserListComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: 'route/search', component: AdminRouteListComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: 'action-log/search', component: AdminActionLogListComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: 'dmp/user/search', component: AdminDmpUserComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule {
}
