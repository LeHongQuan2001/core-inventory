import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GlobalsService} from "../../../services/globals.service";

@Component({
    selector: 'app-layout-partial-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class LayoutPartialFooterComponent implements OnInit, OnDestroy {
    linkGuideDoc = this.globalsService.user.guideDoc;
    
    constructor(
        public activatedRoute: ActivatedRoute,
        private globalsService: GlobalsService
    ) {
    
    }
    
    ngOnInit(): void {
    
    }
    
    ngOnDestroy() {
    
    }
   
    openLinkGuideDoc() {
        window.open(this.linkGuideDoc, '_blank');
    }
    
}
