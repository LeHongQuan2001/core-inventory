import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ErrorDialogComponent} from '../components/_dialogs/error.dialog/error.dialog.component';

@Injectable()
export class ErrorDialogService {

    dialogRef: MatDialogRef<ErrorDialogComponent> | undefined;

    constructor(public dialog: MatDialog,
                private router: Router) { }

    openDialog(data: any): void {
        this.dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '400px',
            data
        });

        this.dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case 'returnHome':
                    this.router.navigate(['/']);
                    break;
            }
        });
    }
}
