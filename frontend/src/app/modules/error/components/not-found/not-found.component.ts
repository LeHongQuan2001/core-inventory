import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Route, Router} from "@angular/router";

@Component({
    selector: 'app-error-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class ErrorNotFoundComponent {

    constructor(public route: Router) {

    }

    goToItems() {
        // @ts-ignore
        // this.router.navigate(['/'], { relativeTo: this.router });

        this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.route.navigate(['/'], );
        });
    }
}
