import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from 'src/app/components/base/base.component';
import {AuthenticationService} from 'src/app/services/authenticate.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {ActionLogModel} from "../../../../models/action-log.model";

declare const AppNoty: any;

@Component({
    selector: 'app-admin-action-log-detail-dialog',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class AdminActionLogDetailDialogComponent extends BaseComponent implements OnInit {
    actionLog: ActionLogModel = new  ActionLogModel();

    constructor(@Inject(MAT_DIALOG_DATA)
                public data: any,
                public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                public dialog: MatDialog,
                private clipboard: Clipboard,
    ) {
        super(authenticationService, activatedRoute, translate);
        this.actionLog = this.data.actionLog
    }

    override ngOnInit() {

    }

    copyCode(code: any) {
        this.clipboard.copy(JSON.stringify(code));
        AppNoty.success([this.translate.instant('modules.admin.actionLog.common.copyCodeSuccess')]);
    }

    checkObjectEmpty(data: any) {
        return Object.keys(data).length === 0;
    }
}
