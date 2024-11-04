import {AfterViewChecked, AfterViewInit, Component} from '@angular/core';

declare const App: any;
declare const AppNoty: any;

@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class LayoutDefaultComponent implements AfterViewInit, AfterViewChecked {
    ngAfterViewInit() {
        App.initCore();
        AppNoty.init();
    }

    ngAfterViewChecked() {
        App.initAfterLoad();
    }
}
