import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-error-bad-request',
    templateUrl: './bad-request.component.html',
    styleUrls: ['./bad-request.component.scss']
})
export class ErrorBadRequestComponent {

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
