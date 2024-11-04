import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from "@ngrx/store";
import {setLoadingSpinner} from 'src/app/store/shared/shared.actions';
import {AppState} from "../../../../store/app.state";
import {loginStart} from '../../state/auth.actions';
import {AuthenticationService} from "../../../../services/authenticate.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "../../../../components/base/base.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class AuthLoginComponent extends BaseComponent {

    loginForm: any;
    pathSignup = '';
    pathForgotPassword = '';
    isShowPassword = false;
    constructor(public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private store: Store<AppState>,
                private router: Router) {

        super(authenticationService, activatedRoute, translate);

        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }

        this.pathSignup = this.environment.admicroSso.register,
        this.pathForgotPassword = this.environment.admicroSso.linkForgotPassword
    }

    override ngOnInit(): void {
        super.ngOnInit();

        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });

    }

    checkFormValid() {
        return this.loginForm.invalid;
    }

    onSubmit() {
        const username = this.loginForm.value.username;
        const password = this.loginForm.value.password;
        this.store.dispatch(setLoadingSpinner({status: true}));
        this.store.dispatch(loginStart({username, password}));
    }

    socialLogin(socialName: string) {
        const width = 520;
        const height = 570;
        // @ts-ignore
        const top = window.top.outerHeight / 2 + window.top.screenY - (width / 2);
        // @ts-ignore
        const left = window.top.outerWidth / 2 + window.top.screenX - (height / 2);
        const path = this.authenticationService.socialLogin(socialName).toString();
        window.open(path, '_blank', `location=yes,height=570,width=520,scrollbars=yes,statu()s=yes,top=${top},left=${left}`);
    }
}
