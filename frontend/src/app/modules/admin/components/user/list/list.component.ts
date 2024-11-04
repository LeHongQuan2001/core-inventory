import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../../components/base/base.component";
import {AuthenticationService} from "../../../../../services/authenticate.service";
import {PageEvent} from "@angular/material/paginator";
import {RoleModel} from "../../../models/role.model";
import {Location} from "@angular/common";
import {environment} from "../../../../../../environments/environment";
import {AdministratorUserService} from "../../../services/user.service";
import {RoleService} from '../../../services/role.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from '@angular/material/dialog';
import {UserModel} from '../../../models/user.model';
import {ConfirmDialogComponent} from 'src/app/components/_dialogs/confirm.dialog/confirm.dialog.component';
// @ts-ignore
import {AdminUserPermissionComponent} from '../dialogs/permission/permission.component';
import {AdminCreateUserComponent} from '../dialogs/create/create.component';
import {Subscription} from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {GlobalsService} from "../../../../../services/globals.service";

declare const $: any;
declare const AppNoty: any;

@Component({
    selector: 'app-administrator-user-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class AdminUserListComponent extends BaseComponent implements OnInit, OnDestroy {
    users: UserModel[] = [];
    roles: RoleModel[] = [];
    status = -2;
    role = -1;
    keyword = '';
    statusSearch = '';
    appSearch: number[] = []
    length = 0;
    pageIndex = 1;
    pageSize = 30;
    checked = false;
    pageSizeOptions: number[] = [20, 30, 50, 100];
    // MatPaginator Output
    pageEvent: PageEvent = new PageEvent();
    loadingState = false;
    statuses = [-1, 0, 1];
    locationRef = environment.baseHref;
    displayedColumns: string[] = ['sequence', 'name', 'email', 'status', 'role', 'action'];

    avatarDefaultImgUrl = this.globalsService.user.avatar.default;

    subscribeUser!: Subscription;

    constructor(public override authenticationService: AuthenticationService,
                public override translate: TranslateService,
                public override activatedRoute: ActivatedRoute,
                private userService: AdministratorUserService,
                private location: Location,
                private localStorageService: LocalStorageService,
                public dialog: MatDialog,
                private roleService: RoleService,
                private globalsService: GlobalsService,
                ) {
        super(authenticationService, activatedRoute, translate);

        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.keyword = params.keyword ?? '';
            this.statusSearch = params.status ?? '';
            this.role = params.role ?? -1;
            this.pageSize = params.limit ?? this.pageSize;
            this.pageIndex = params.page ?? this.pageIndex;
            const appSearch = params.appSearch ? params.appSearch.split(',') : [];
            // @ts-ignore
            this.appSearch = appSearch.map(id => {
                if (id !== undefined && !isNaN(id)) {
                    return parseInt(id);
                }
                // @ts-ignore
            }).filter(id => id)
        });

    }

    override ngOnInit(): void {
        this.getDataUser();
        this._getRoles({});
    }

    override ngOnDestroy() {
        if (this.subscribeUser) {
            this.subscribeUser.unsubscribe();
        }
    }

    getDataUser(reset?: boolean): void {
        this.loadingState = true;
        const queries: any = {
            limit: this.pageSize,
        };
        if (this.statusSearch && this.statusSearch !== '') {
            queries.status = this.statusSearch;
        }
        if (reset) {
            this.pageIndex = 1;
        } else {
            if (this.pageIndex > 0) {
                queries.page = this.pageIndex;
            }
        }
        if (this.keyword !== '') {
            queries.keyword = encodeURIComponent(this.keyword);
        }
        if (this.appSearch.length > 0) {
            queries.appSearch = this.appSearch.join(',');
        }

        queries.role = encodeURIComponent(this.role);
        this.subscribeUser = this.userService.get(queries).subscribe((result) => {
            this.loadingState = false;
            this.users = result.data.length > 0 ? result.data : [];
            this.length = result.count;
         
            setTimeout(() => {
                $('.select-fixed-single.user-set-role')
                    .select2({
                        minimumResultsForSearch: Infinity,
                        width: '100%',
                    })
                    .on('select2:select', (e: any) => {
                        const data = e.params.data;
                        const roleId = e.params.data.id;
                        const userId = $(data.element)
                            .parents('select')
                            .data('user-id');
                        // tslint:disable-next-line:comment-format
                        this.saveUserRole(userId, roleId);
                    });

                $('.user-role')
                    .select2({
                        minimumResultsForSearch: Infinity,
                        width: '100%',
                    })
                    .on('select2:select', (e: any) => {
                        const data = e.params.data;
                        // tslint:disable-next-line:radix
                        this.role = parseInt(data.id);
                    });

                $('.user-status')
                    .select2({
                        minimumResultsForSearch: Infinity,
                        width: '100%',
                    })
                    .on('select2:select', (e: any) => {
                        const data = e.params.data;
                        // tslint:disable-next-line:radix
                        this.statusSearch = data.id;
                        // this.role = parseInt(data.id);
                    });
            }, 100);
        });

        const params = [];
        // tslint:disable-next-line:forin
        for (const i in queries) {
            params.push(i + '=' + queries[i]);
        }
        this.location.replaceState(
            '/' + environment.administratorPrefix + '/user/search',
            params.join('&')
        );
    }

    private _getRoles(queries: any) {
        this.roleService.get(queries).subscribe((result) => {
            this.roles = result.data.length > 0 ? result.data : [];
        });
    }

    saveUserRole(userId: number, roleId: number) {
        this.loadingState = true;
        this.userService.setRole(userId, roleId).subscribe((result) => {
            this.loadingState = false;
            if (result.status === 1) {
                this.users
                    .filter((v) => v.id === userId)
                    .forEach((v) => {
                        v.roleId = Number(roleId);
                        v.status = result.status ?? v.status;
                    });
                // notify
                AppNoty.success([this.translate.instant('common.notify.success.message')]);
                return;
            }
            AppNoty.error([this.translate.instant('common.notify.error.message')]);
        });
    }

    openUserSwitch(user: UserModel) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            autoFocus: true,
            width: '400px',
            height: 'auto',
            panelClass: 'admin-dialog-role-create',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadingState = true;
                this.authenticationService.switchUser(user.id).subscribe((response) => {
                    if (response.status === 1) {
                        this.localStorageService.remove('domain_selected');
                        const dataOriginalUser = this.authenticationService.getUserFromLocalStorage();
                        this.authenticationService.setOriginalUserInLocalStorage(dataOriginalUser);
                        const formatUser = this.authenticationService.formatUser(response?.data?.user);
                        this.authenticationService.setUserInLocalStorage(formatUser);
                        window.location.href = this.locationRef;
                        return;
                    }
                    AppNoty.error([response.message]);
                });
            }
        });

    }

    openRolePermission(user: UserModel) {
        if (user.roleId == 1) {
            return;
        }
        const dialogRef = this.dialog.open(AdminUserPermissionComponent, {
            autoFocus: false,
            panelClass: 'admin-dialog-role-permission',
            width: '1000px',
            height: 'auto',
            maxHeight: '80vh',
            data: {
                user,
                roles: this.roles,
                statuses: this.statuses
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getDataUser();
            }
        });
    }

    openCreateUser() {
        const dialogRef = this.dialog.open(AdminCreateUserComponent, {
            autoFocus: false,
            panelClass: 'admin-dialog-role-permission',
            width: '1000px',
            height: 'auto',
            maxHeight: '80vh',
            data: {
                roles: this.roles,
                statuses: this.statuses
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getDataUser();
            }
        });
    }
    
    getPaginator(event: any) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getDataUser();
    }
}
