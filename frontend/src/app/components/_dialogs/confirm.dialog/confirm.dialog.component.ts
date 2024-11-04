import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-confirm.dialog',
    templateUrl: './confirm.dialog.component.html',
    styleUrls: ['./confirm.dialog.component.scss']
})
export class ConfirmDialogComponent {

    public title: string;

    public confirmMessage: string;

    constructor(public translation: TranslateService,
                public dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,) {
        this.title = data?.title ?? this.translation.instant('common.confirm');
        this.confirmMessage = data?.message ?? this.translation.instant('common.confirmMessage');

    }
}
