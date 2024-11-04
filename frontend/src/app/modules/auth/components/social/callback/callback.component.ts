import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {BaseComponent} from 'src/app/components/base/base.component';
import {User} from 'src/app/models/user.model';
import {AuthenticationService} from 'src/app/services/authenticate.service';

declare const AppNoty: any;

@Component({
    selector: 'app-auth-social-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class AuthSocialCallbackComponent extends BaseComponent implements OnInit {
    code: any;
    params: any;
    socialName: string = 'google';
    currentUserSubject: BehaviorSubject<User>;
    // @ts-ignore
    currentUser: Observable<User>;

    checkAuth: boolean = false;

    constructor(
        public override activatedRoute: ActivatedRoute,
        public override translate: TranslateService,
        public override authenticationService: AuthenticationService,
        public router: Router) {
        super(authenticationService, activatedRoute, translate);

        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });

        this.activatedRoute.params.subscribe( params => {
            this.socialName = params['socialName'];
        });

        // @ts-ignore
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.authenticationService.key)))
        this.currentUser = this.currentUserSubject.asObservable();

    }

    override ngOnInit(): void {
        this.getUser();
    }

    private getUser() {
        this.authenticationService.socialCallback(this.socialName, this.params).subscribe((result: any) => {
            const opener = window.opener || window;
            if (result && result.accessToken) {
                const user = this.authenticationService.formatUser(result);
                this.authenticationService.setUserInLocalStorage(user);
                opener.location.href = '/';
            } else { 
                opener.AppNoty.error([this.translate.instant('modules.auth.common.message.error.wrongOrInvalidEmail')]);
            }
            window.close();
        })
    }
}
