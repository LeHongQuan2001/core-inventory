import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from 'src/app/components/base/base.component';
import {AuthenticationService} from 'src/app/services/authenticate.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Location} from "@angular/common";
import {environment} from "../../../../../../environments/environment";
import {AdminActionLogDetailDialogComponent} from '../dialogs/detail/detail.component';
import {ActionLogService} from "../../../services/action-log.service";
import {ActionLogModel} from "../../../models/action-log.model";
import {DeviceDetectorService} from "ngx-device-detector";
import {GlobalsService} from "../../../../../services/globals.service";

declare const $: any;

@Component({
    selector: 'app-admin-action-log-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class AdminActionLogListComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    pageSize = 20;
    pageIndex = 1;
    pageSizeOptions: number[] = [20, 30, 50, 100];
    keyword: string = '';
    dataSourceActionLogs = new MatTableDataSource<ActionLogModel>([]);
    actionLogs: ActionLogModel[] = [];
    displayedColumns: string[] = ['sequence', 'account', 'ipAndDevice', 'route', 'module', 'action', 'time', 'actionLog'];
    length = 0;
    actions = this.globalsService.core.actions;
    modules = this.globalsService.core.modules;
    actionTypes: any[] = [];
    moduleTypes: any[] = [];
    dataFilter = {
        action: -1,
        module: '-1'
    }
    defaultAvatar = this.globalsService.user.avatar.default;

    constructor(public override authenticationService: AuthenticationService,
                public override translate: TranslateService,
                public override activatedRoute: ActivatedRoute,
                private actionLogService: ActionLogService,
                private location: Location,
                private deviceService: DeviceDetectorService,
                private globalsService: GlobalsService,
                public dialog: MatDialog) {
        super(authenticationService, activatedRoute, translate);
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.keyword = params.keyword ?? '';
            this.pageSize = params.limit ?? this.pageSize;
            if (!this.pageSizeOptions.includes(this.pageSize)) {
                this.pageSize = this.pageSizeOptions[0];
            }
        });
        this.actionTypes.push({
            id: -1,
            text: this.translate.instant('modules.admin.actionLog.common.allAction'),
            selected: this.dataFilter.action == -1
        });
        this.moduleTypes.push({
            id: '-1',
            text: this.translate.instant('modules.admin.actionLog.common.allModule'),
            selected: !this.dataFilter.module
        });
        this.fromDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
        this.toDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd')
    }

    ngAfterViewInit(): void {
        this.initSelect2Action();
        this.initSelect2Module();
        this.initDatePicker('right', !this.isMobile, this.isMobile);
    }

    override ngOnInit(): void {
        this.getData();
    }

    override ngOnDestroy() {
        this.destroyDatePicker(this.datePickerInstance);
    }
    
    get isMobile() {
        return this.deviceService.isMobile();
    }

    initSelect2Action() {
        if (this.actions.length) {
            for (const act of this.actions) {
                this.actionTypes.push({
                    id: act.id,
                    text: act.name,
                    selected: this.dataFilter.action == act.id
                });
            }
        }
        $('.action-log-select-action').select2({
            data: this.actionTypes
        }).on("select2:select", (e: any) => {
            const act = parseInt(e.params.data.id);
            this.dataFilter.action = act;
        });
    }

    initSelect2Module() {
        if (this.modules.length) {
            for (const mdl of this.modules) {
                this.moduleTypes.push({
                    id: mdl.id,
                    text: mdl.name,
                    selected: this.dataFilter.module == mdl.id
                });
            }
        }
        $('.action-log-select-module').select2({
            data: this.moduleTypes
        }).on("select2:select", (e: any) => {
            const mdl = e.params.data.id;
            this.dataFilter.module = mdl;
        });
    }

    getData(reset?: boolean) {
        const queries: any = {
            limit: this.pageSize,
            fd: this.fromDate,
            td: this.toDate
        };
        if (reset) {
            this.pageIndex = 1;
            queries.page = this.pageIndex;
        } else {
            if (this.pageIndex > 0) {
                queries.page = this.pageIndex;
            }
        }
        if (this.keyword !== '') {
            queries.keyword = encodeURIComponent(this.keyword);
        }
        if (this.dataFilter.action !== -1) {
            queries.action = this.actions.find((e: any) => e.id === this.dataFilter.action)?.name;
        }
        if (this.dataFilter.module && this.dataFilter.module !== '-1') {
            queries.module = this.dataFilter.module;
        }
        this.actionLogService.search(queries).subscribe((result: any) => {
            if (result.status === 1) {
                this.actionLogs = result?.data?.logList ?? [];
                this.dataSourceActionLogs = new MatTableDataSource(this.actionLogs);
                this.length = result?.data?.count;
            }
        });

        const params = [];
        for (const i in queries) {
            params.push(i + '=' + queries[i]);
        }
        this.location.replaceState('/' + environment.administratorPrefix + '/action-log/search', params.join('&'));
    }

    getPaginator(event: any) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getData();
    }

    openDetail(actionLog: ActionLogModel) {
        this.dialog.open(AdminActionLogDetailDialogComponent, {
            autoFocus: false,
            panelClass: 'admin-dialog-action-detail',
            width: '1000px',
            height: 'auto',
            maxHeight: '80vh',
            data: {
                actionLog
            }
        });
    }

    autoFilter(log: ActionLogModel, type: number) {
        this.pageIndex = 1;
        switch (type) {
            case 1:
                this.dataFilter.module = log.module;
                $('.action-log-select-module').empty();
                this.moduleTypes = [{
                    id: '-1',
                    text: this.translate.instant('modules.admin.actionLog.common.allModule'),
                    selected: !this.dataFilter.module
                }];
                this.initSelect2Module();
                this.getData();
                break;
            case 2:
                this.dataFilter.action = this.actions.find((e: any) => {return e.name === log.action})?.id ?? -1;
                $('.action-log-select-action').empty();
                this.actionTypes = [
                    {
                        id: -1,
                        text: this.translate.instant('modules.admin.actionLog.common.allAction'),
                        selected: this.dataFilter.action == -1
                    }
                ];
                this.initSelect2Action();
                this.getData();
                break;
            default:
                break;
        }
    }
}
