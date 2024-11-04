import {Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { autoLogin } from './modules/auth/state/auth.actions';
import { EncryptService } from './services/encrypt.service';
import {AppState} from "./store/app.state";
import {getErrorMessage, getLoading} from "./store/shared/shared.selector";
import {GrowthBookService} from "./services/growth-book.service";
import {environment} from "../environments/environment";
import {AuthenticationService} from "./services/authenticate.service";
import {LocalStorageService} from "./services/local-storage.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = this.translate.instant('common.name');

    showLoading!: Observable<boolean>;
    errorMessage!: Observable<string>;

    constructor(private store: Store<AppState>,
                private translate: TranslateService,
                private encryptService: EncryptService,
                private growthBookService: GrowthBookService,
                private authenticationService: AuthenticationService,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        const keys = this.localStorageService.getEncryptKeys();
        this.encryptService.genKeys(keys);
        if (keys == null) {
            this.localStorageService.setEncryptKeys({
                k: this.encryptService.clientPrivateKey,
                p: this.encryptService.clientPublicKey,
            })
        }
        
        this.showLoading = this.store.select(getLoading);
        this.errorMessage = this.store.select(getErrorMessage);
        this.store.dispatch(autoLogin());

        if (environment.growthBook.enabled) {
            const currentUser = this.authenticationService.getUserFromLocalStorage();
            this.growthBookService.setAttribute(currentUser);
            this.growthBookService.loadFeatures().then(e => {});
        }
    }
}
