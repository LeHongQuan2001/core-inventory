import {Component, OnInit, OnDestroy} from '@angular/core';
import {BaseComponent} from "../../../../../components/base/base.component";
import {AuthenticationService} from "../../../../../services/authenticate.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../../../environments/environment";
import {Subscription} from "rxjs";
import {AdministratorUserService} from "../../../services/user.service";
import {Location} from "@angular/common";
import {UserModel} from "../../../models/user.model";
import {GlobalsService} from "../../../../../services/globals.service";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogComponent} from "../../../../../components/_dialogs/confirm.dialog/confirm.dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LocalStorageService} from "../../../../../services/local-storage.service";
import {RuleCheckerService} from "../../../../../services/rule-checker.service";

declare const AppNoty: any;

@Component({
    selector: 'app-administrator-dmp-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class AdminDmpUserComponent extends BaseComponent implements OnInit, OnDestroy {
    length = 0;
    pageIndex = 1;
    pageSize = 30;
    keyword = '';
    loadingState = false;
    subscribeUser!: Subscription;
    users: UserModel[] = [];
    pageSizeOptions: number[] = [20, 30, 50, 100];
    pageEvent: PageEvent = new PageEvent();
    statuses = [-1, 0, 1];
    displayedColumns: string[] = ['sequence', 'name', 'email', 'status', 'action'];
    locationRef = environment.baseHref;
    avatarDefaultImgUrl = this.globalsService.user.avatar.default;

    constructor(
        public override authenticationService: AuthenticationService,
        public override translate: TranslateService,
        public override activatedRoute: ActivatedRoute,
        private userService: AdministratorUserService,
        private globalsService: GlobalsService,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
        public ruleCheckerService: RuleCheckerService,
        private location: Location
    ) {
        super(authenticationService, activatedRoute, translate);

        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.keyword = params.keyword ?? '';
            this.pageSize = params.limit ?? this.pageSize;
            this.pageIndex = params.page ?? this.pageIndex;
        });
    }

    override ngOnInit() {
        super.ngOnInit();
        this.getDataUser();
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

        this.subscribeUser = this.userService.search(queries).subscribe((result) => {
            this.loadingState = false;
            this.users = result.data.length > 0 ? result.data : [];
            this.length = result.count;
        });

        const params = [];
        // tslint:disable-next-line:forin
        for (const i in queries) {
            params.push(i + '=' + queries[i]);
        }
        this.location.replaceState(
            '/' + environment.administratorPrefix + '/dmp/user/search',
            params.join('&')
        );
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

    getPaginator(event: any) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getDataUser();
    }
}
