import {AfterViewChecked, AfterViewInit, Component} from '@angular/core';

declare const App: any;
declare const AppNoty: any;

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements AfterViewInit, AfterViewChecked {
    ngAfterViewInit() {
        App.initCore();
        AppNoty.init();
    }

    ngAfterViewChecked() {
        App.initAfterLoad();
    }
}
