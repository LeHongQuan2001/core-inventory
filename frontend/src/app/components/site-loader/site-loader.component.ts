import { Component, OnInit } from '@angular/core';
import {SiteLoaderService} from "../../services/site-loader.service";

@Component({
    selector: 'app-site-loader',
    templateUrl: './site-loader.component.html',
    styleUrls: ['./site-loader.component.scss']
})
export class SiteLoaderComponent implements OnInit {

    loading = false;

    constructor(private loaderService: SiteLoaderService) {
        this.loaderService.isLoading.subscribe((v: boolean) => {
            this.loading = v;
        });
    }
    ngOnInit() {
    }

}
