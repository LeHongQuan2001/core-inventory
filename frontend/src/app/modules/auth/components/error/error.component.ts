import {Component} from '@angular/core';
import {BaseComponent} from "../../../../components/base/base.component";
import {AuthenticationService} from "../../../../services/authenticate.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-auth-error',
    templateUrl: './error.component.html',
    styleUrls: []
})
export class AuthErrorComponent extends BaseComponent {

    constructor(public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private router: Router) {

        super(authenticationService, activatedRoute, translate);

        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }
}
