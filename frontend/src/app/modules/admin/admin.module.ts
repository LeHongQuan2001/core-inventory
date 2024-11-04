import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EffectsModule} from "@ngrx/effects";
import {AdminRoutingModule} from "./admin-routing.module";
import {MaterialModule} from "../../shared-modules/material.module";
import {AdminRoleListComponent} from './components/role/list/list.component';
import {AdminUserListComponent} from './components/user/list/list.component';
import {SharedModule} from "../../shared-modules/shared.module";
import {AdminRoleCreateComponent} from "./components/role/dialogs/create/create.component";
import {AdminRolePermissionComponent} from "./components/role/dialogs/permission/permission.component";
import { MatChipsModule } from '@angular/material/chips';
import { AdminUserPermissionComponent } from './components/user/dialogs/permission/permission.component';
import {AdminRouteListComponent} from "./components/route/list/list.component";
import { AdminUserProfileComponent } from './components/user/dialogs/profile/profile.component';
import { AdminCreateUserComponent } from './components/user/dialogs/create/create.component';
import {AdminActionLogDetailDialogComponent} from "./components/action-log/dialogs/detail/detail.component";
import {AdminActionLogListComponent} from "./components/action-log/list/list.component";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AdminDmpUserComponent } from './components/dmp/user/user.component';

@NgModule({
    declarations: [
        AdminUserListComponent,
        AdminRoleListComponent,
        AdminRoleCreateComponent,
        AdminRolePermissionComponent,
        AdminUserPermissionComponent,
        AdminRouteListComponent,
        AdminUserProfileComponent,
        AdminCreateUserComponent,
        AdminActionLogListComponent,
        AdminActionLogDetailDialogComponent,
        AdminDmpUserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        EffectsModule.forFeature(),
        MaterialModule,
        AdminRoutingModule,
        MatChipsModule,
        MatAutocompleteModule
    ]
})
export class AdminModule {
}
