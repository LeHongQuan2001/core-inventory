import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../components/base/base.component";
import {AuthenticationService} from "../../../services/authenticate.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {RuleCheckerService} from "../../../services/rule-checker.service";

declare const $: any;

@Component({
    selector: 'app-layout-partial-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [RuleCheckerService]
})

export class LayoutPartialSidebarComponent extends BaseComponent implements OnInit {
    logoDfUrlMini = "./assets/styles/default/images/logo-mini.png";
    logoDef = "./assets/styles/default/images/logo.png"
    
    constructor(public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                public ruleCheckerService: RuleCheckerService) {
        super(authenticationService, activatedRoute, translate);
    }
    
    override ngOnInit() {
        super.ngOnInit();
        $(document).ready(() => {
            $('.nav-item.nav-item-submenu > ul').each((i: any, e: any) => {
                const items = $(e).find('> li');
                if (items.length === 0) {
                    $(e).parent().remove()
                }
            })
        });
        this.ruleCheckerService.initRule();
    }
}
