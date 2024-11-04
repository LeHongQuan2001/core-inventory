import {AfterViewChecked, AfterViewInit, Component} from '@angular/core';

declare const App: any;
declare const AppNoty: any;

@Component({
    selector: 'app-layout-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LayoutLandingPageComponent implements AfterViewInit, AfterViewChecked {
    ngAfterViewInit() {
        App.initCore();
        AppNoty.init();
    }

    ngAfterViewChecked() {
        App.initAfterLoad();
    }
}
