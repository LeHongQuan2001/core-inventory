import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../../components/base/base.component";
import {AuthenticationService} from "../../../../../services/authenticate.service";
import {PageEvent} from "@angular/material/paginator";
import {RoleModel} from "../../../models/role.model";
import {environment} from "../../../../../../environments/environment";
import {RoleService} from "../../../services/role.service";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AdminRoleCreateComponent} from "../dialogs/create/create.component";
import {ActivatedRoute} from "@angular/router";
import {ConfirmDialogComponent} from "../../../../../components/_dialogs/confirm.dialog/confirm.dialog.component";
import {AdminRolePermissionComponent} from "../dialogs/permission/permission.component";
import {TranslateService} from "@ngx-translate/core";
import {AdministratorPaginationService} from "../../../../../services/pagination.service";
import {Subscription} from 'rxjs';

declare const $: any;
declare const AppNoty: any;

@Component({
    selector: 'app-administrator-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class AdminRoleListComponent extends BaseComponent implements OnInit, OnDestroy {
    roles: RoleModel[] = [];
    status: any;
    keyword = '';
    totalRecord = 0;
    pageIndex = 1;
    pageSize = 20;
    pageSizeOptions: number[] = [20, 30, 50, 100];
    // MatPaginator Output
    pageEvent: PageEvent = new PageEvent();
    loadingState = false;
    statuses = [1, 0];
    listPermissionLocked = [1, 0];

    displayedColumns: string[] = ['sequence', 'name', 'status', 'action'];

    activePagination = true;
    subscribeRole!: Subscription;
    subscribeDataPagination!: Subscription;

    rolesConfig = environment.roles;

    constructor(public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private roleService: RoleService,
                public administratorPaginationService: AdministratorPaginationService,
                private location: Location,
                public dialog: MatDialog) {
        super(authenticationService, activatedRoute, translate);

        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.pageSize = params.limit ?? this.pageSize;
            this.pageIndex = params.page ?? this.pageIndex;
            this.keyword = params.keyword ?? '';
            this.status = params.status || undefined;
        });
    }

    override ngOnInit(): void {
        this.getRolesPaginator();
        this.getData();
    }

    ngAfterViewInit() {
        $('.role-status').select2({
            minimumResultsForSearch: Infinity,
            width: '100%'
        }).on("select2:select", (e: any) => {
            const value = e.params.data.id;
            this.status = parseInt(value);
        });
    }

    override ngOnDestroy() {
        this.subscribeRole.unsubscribe();
        this.subscribeDataPagination.unsubscribe();
        if (this.subscribeRole.closed) {
            this.administratorPaginationService.resetActivePagination(false);
        }
    }

    getRolesPaginator() {
        this.subscribeDataPagination = this.administratorPaginationService.dataPaginate.subscribe((data: any) => {
            if (data) {
                this.pageIndex = data.pageIndex;
                this.pageSize = data.pageSize;
                this.getData();
            }
        });
    }

    setDataPagination(data: any) {
        this.administratorPaginationService.setDataRecords(data);
    }

    getData() {
        this.loadingState = true;

        const queries: any = {
            limit: this.pageSize
        };
        if (this.pageIndex > 0) {
            queries.page = this.pageIndex;
        }
        if (this.keyword !== '') {
            queries.keyword = encodeURIComponent(this.keyword);
        }
        if (typeof this.status !== 'undefined' && this.status !== -1) {
            queries.status = this.status;
        }
        this.subscribeRole = this.roleService.get(queries).subscribe(result => {
            this.loadingState = false;
            this.roles = result.data || [];
            this.totalRecord = result.count || 0;

            this.setDataPagination({
                numberOfRecords: this.roles.length,
                length: this.totalRecord,
                pageSizeOptions: this.pageSizeOptions,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                activePagination: this.activePagination
            });
        });

        const params = [];
        for (const i in queries) {
            params.push(i + '=' + queries[i]);
        }

        this.location.replaceState('/' + environment.administratorPrefix + '/role/search', params.join('&'));
    }

    openRolePermission(role: RoleModel) {
        const dialogRef = this.dialog.open(AdminRolePermissionComponent, {
            autoFocus: false,
            panelClass: 'admin-dialog-role-permission',
            width: '1600px',
            height: 'auto',
            maxHeight: '80vh',
            data: {
                role,
                statuses: this.statuses,
                listPermissionLocked: this.listPermissionLocked
            }
        });
        dialogRef.afterClosed().subscribe(result => {

        });
    }

    openCreatePermission() {
        const dialogRef = this.dialog.open(AdminRoleCreateComponent, {
            autoFocus: true,
            width: '400px',
            height: 'auto',
            panelClass: 'admin-dialog-role-create',
            data: {
                statuses: this.statuses,
                listPermissionLocked: this.listPermissionLocked
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getData();
            }
        });
    }

    // @ts-ignore
    openDialogDeleteRole(role: RoleModel) {
        if (role.permissionLocked === 1) {
            return false;
        }
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            autoFocus: false,
            disableClose: false
        });
        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteRole(role);
            }
        });
    }

    deleteRole(role: RoleModel) {
        this.roleService.delete(role).subscribe(response => {
            if (response.status) {
                this.getData();
                AppNoty.success([this.translate.instant('common.notify.success.message')]);
                return;
            }
            AppNoty.error([this.translate.instant('common.notify.error.message')]);
        });
    }

    checkRoleConfig(roleId: number) {
        return Object.values(this.rolesConfig).includes(roleId);
    }
}
