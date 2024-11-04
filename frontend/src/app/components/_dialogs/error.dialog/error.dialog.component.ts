import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-error.dialog',
  templateUrl: './error.dialog.component.html',
  styleUrls: ['./error.dialog.component.scss']
})
export class ErrorDialogComponent {

    public title: string;

    public message: string | undefined;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<ErrorDialogComponent>,
                public translate: TranslateService) {
        this.title = this.translate.instant('common.notify.error.title');
    }
}
