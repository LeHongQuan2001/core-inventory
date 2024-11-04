import {Component, ElementRef, OnInit, ViewChild, Inject} from '@angular/core';
import {BaseComponent} from "../../../../../../components/base/base.component";
import {AclModel} from "../../../../models/acl.model";
import {RoleModel} from "../../../../models/role.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdministratorPermissionService} from "../../../../services/permission.service";
import {RoleService} from "../../../../services/role.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../../../../services/authenticate.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {ActivatedRoute} from "@angular/router";

declare const $: any;
declare const AppNoty: any;

// declare const JSONEditor: any;

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss']
})

export class AdminRolePermissionComponent extends BaseComponent implements OnInit {
    objectType = 'role';
    title = 'Role Permission';
    loadingState = false;
    acl: AclModel[] = [];
    aclAll: AclModel[] = [];
    aclAllow: AclModel[] = [];
    aclDeny: AclModel[] = [];
    pageIndex = 0;
    pageSize = 30;
    length = 0;
    role: RoleModel = new RoleModel({});
    statuses: [] = [];
    listPermissionLocked: [] = [];

    visible = true;
    selectable = true;
    removable = true;
    // @ts-ignore
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('auto') matAutocomplete: MatAutocomplete | undefined;
    @ViewChild('keyword') keyword: ElementRef | undefined;


    extraPermissionEditor = undefined;

    packages: [] = [];
    package = '';

    tabCurrent = 'permission-tab-role-info';

    constructor(@Inject(MAT_DIALOG_DATA)
                public data: any,
                public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private dialogRef: MatDialogRef<AdminRolePermissionComponent>,
                private permissionService: AdministratorPermissionService,
                private roleService: RoleService) {
        super(authenticationService, activatedRoute, translate);

        // dialogRef.disableClose = true;

        this.role = data.role;
        this.statuses = data.statuses;
        this.listPermissionLocked = data.listPermissionLocked;

        setTimeout(() => {
            $('.select-fixed-single.role-update-statuses').select2({
                minimumResultsForSearch: Infinity,
                width: '300px'
            }).on("select2:select", (e: any) => {
                const status = e.params.data.id;
                // tslint:disable-next-line:radix
                this.role.status = parseInt(status);
            });
            $('.select-fixed-single.role-update-permission-locked').select2({
                minimumResultsForSearch: Infinity,
                width: '300px'
            }).on("select2:select", (e: any) => {
                const permissionLocked = e.params.data.id;
                // tslint:disable-next-line:radix
                this.role.permissionLocked = parseInt(permissionLocked);
            });
        }, 300);

        this.getData();
    }

    saveRoleInfo() {
        this.loadingState = true;
        this.roleService.update(this.role).subscribe(result => {
            this.loadingState = false;
            AppNoty.success([this.translate.instant('common.notify.success.message')]);
            this.dialogRef.close(true);
        });
    }

    getData() {
        this.loadingState = true;
        this.permissionService.details(this.objectType, this.role.id).subscribe(result => {
            this.loadingState = false;
            this.acl = result.data.routes.all.length > 0 ? result.data.routes.all : [];
            this.aclAll = this.acl;
            this.aclAllow = result.data.routes.allow.length > 0 ? result.data.routes.allow : [];
            this.aclDeny = result.data.routes.deny.length > 0 ? result.data.routes.deny : [];
            this.length = result.count;
            this.packages = result.data.packages;

            setTimeout(() => {
                $('.select-fixed-single.user-packages').select2({
                    minimumResultsForSearch: Infinity,
                    width: '100%'
                }).on("select2:select", (e: any) => {
                    const data = e.params.data;
                    const packageId = e.params.data.id;
                    this.package = packageId;
                });
            }, 300);
        });
    }

    filterRoutes($event: any) {
        this.aclAll = this.acl.filter(e => {
            // @ts-ignore
            const keyword = this.keyword.nativeElement.value.trim();
            const keywordResult = keyword === '' ? true
                : (keyword && (e.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
                    || e.uri.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) ? true : (keyword === '' ? true : false));
            const packageResult = this.package === '' ? true
                : (this.package && this.package === (e.vendor + ' / ' + e.package) ? true : false);

            return keywordResult && packageResult;
        });
    }

    public toggle(event: MatSlideToggleChange, acl: AclModel) {
        this.loadingState = true;
        this.permissionService.set(this.objectType, this.role.id, acl, event.checked).subscribe(result => {
            this.loadingState = false;
            acl.isAllow = result.data.allow;
            if (acl.isAllow) {
                this.aclAllow.push(acl);
                const index = this.aclDeny.indexOf(acl);
                this.aclDeny.splice(index, 1);
            } else {
                this.aclDeny.push(acl);
                const index = this.aclAllow.indexOf(acl);
                this.aclAllow.splice(index, 1);
            }
            AppNoty.success([this.translate.instant('common.notify.success.message')]);
        });
    }
}
