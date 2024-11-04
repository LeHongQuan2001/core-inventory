import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../../../services/authenticate.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {RuleCheckerService} from "../../../../../services/rule-checker.service";
import {BaseComponent} from "../../../../../components/base/base.component";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [AuthenticationService]
})

export class InventoryHomeDashboardComponent extends BaseComponent implements OnInit {
    report: any = {};
    
    constructor(public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                public ruleCheckerService: RuleCheckerService) {
        super(authenticationService, activatedRoute, translate);
    }
    
    override ngOnInit() {
        this.getData();
    }
    
    getData() {
    
    }
    
}
