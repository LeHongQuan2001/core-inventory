import {Component, OnInit} from '@angular/core';
import {getErrorMessage, getSuccessMessage} from "../../../store/shared/shared.selector";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app.state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-shared-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class SharedAlertMessageComponent implements OnInit {

    errorMessage!: Observable<string>;
    successMessage!: Observable<string>;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.errorMessage = this.store.select(getErrorMessage);
        this.successMessage = this.store.select(getSuccessMessage);
    }
}
