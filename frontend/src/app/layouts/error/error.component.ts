import {Component, OnDestroy, OnInit} from '@angular/core';

declare const $: any;

@Component({
    selector: 'app-layout-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class LayoutErrorComponent implements OnInit, OnDestroy {
    ngOnInit() {
        $('body').removeAttr('class').addClass('errors');
    }

    ngOnDestroy() {
        $('body').removeAttr('class').addClass('sidebar-main-resized');
    }
}
