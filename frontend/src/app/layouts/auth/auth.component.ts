import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

declare const App: any;
declare const AppNoty: any;
declare const $: any;

@Component({
  selector: 'app-layout-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class LayoutAuth implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

    ngOnInit() {
        $('body').removeAttr('class').addClass('authenticate');
    }

    ngOnDestroy() {
        $('body').removeAttr('class').addClass('sidebar-main-resized');
    }

    ngAfterViewInit() {
        App.initCore();
        AppNoty.init();
    }

    ngAfterViewChecked() {
        App.initAfterLoad();
    }
}
