import {Component, OnInit, AfterViewInit} from '@angular/core';
import {BaseComponent} from "../../../components/base/base.component";
import {AuthenticationService} from "../../../services/authenticate.service";
import {autoLogout} from "../../../modules/auth/state/auth.actions";
import {AuthState} from "../../../modules/auth/state/auth.state";
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {Subject} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from 'src/environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {AdminUserProfileComponent} from 'src/app/modules/admin/components/user/dialogs/profile/profile.component';
import {LocalStorageService} from "../../../services/local-storage.service";
import {GlobalsService} from "../../../services/globals.service";
import {debounceTime} from "rxjs/operators";
import {RuleCheckerService} from "../../../services/rule-checker.service";

@Component({
    selector: 'app-layout-partial-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [RuleCheckerService]
})

export class LayoutPartialHeaderComponent extends BaseComponent implements OnInit, AfterViewInit {
    
    loadingState = false;
    pageEvent: PageEvent = new PageEvent();
    pageSize = 50;
    pageIndex = 1;
    keyword = '';
    searchData = new Subject<string>();
    locationRef = environment.baseHref;
    imageSrc = this.globalsService.user.avatar.default;
    userInfo: any;
    linkGuideDoc = this.globalsService.user.guideDoc;
    windowHeight = 0;
    
    constructor(public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private location: Location,
                private localStorageService: LocalStorageService,
                private globalsService: GlobalsService,
                public ruleCheckerService: RuleCheckerService,
                public route: Router,
                public dialog: MatDialog,
                private store: Store<AuthState>) {
        super(authenticationService, activatedRoute, translate);
        this.userInfo = this.currentUser;
        this.imageSrc = this.userInfo && this.userInfo.avatar
            ? this.userInfo.avatar
            : this.imageSrc;
    }
    
    override ngOnInit() {
        super.ngOnInit();
        this.search();
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
            this.autoContentHeight();
            this.resizeWindow();
        }, 300);
    }
    
    logout() {
        this.store.dispatch(autoLogout());
    }
    
    switchOriginalUser = () => {
        const dataOriginalUser = this.authenticationService.getUserOriginalFromLocalStorage();
        this.authenticationService.setUserSwitchInLocalStorage(dataOriginalUser);
        this.authenticationService.removeUserOriginal();
        window.location.href = this.locationRef;
    }
    
    openProfile() {
        const dialogRef = this.dialog.open(AdminUserProfileComponent, {
            autoFocus: false,
            panelClass: 'app-profile',
            id: 'app-profile',
            width: '400px',
            maxHeight: '90vh',
        });
        dialogRef.afterClosed().subscribe(result => {
            this.currentUser = this.authenticationService.getUserFromLocalStorage();
            this.imageSrc = this.currentUser && this.currentUser.avatar || this.imageSrc;
        });
    }
    
    openLinkGuideDoc() {
        window.open(this.linkGuideDoc, '_blank');
    }
    
    autoContentHeight() {
        const footer = $('#footer').innerHeight() ?? 0;
        const header = $('#header').innerHeight() ?? 0;
        this.windowHeight = window.innerHeight;
        $('.content-inner').css({
            height: this.windowHeight ? this.windowHeight - header : '100vh',
            'padding-bottom': footer
        });
    }
    
    search() {
    
    }
    
    onSearchData(event: any) {
    
    }
    
    selectAudience(audience: any) {
    
    }
    
    selectWebsite(website: any) {
    
    }
    
    selectRoute(type: any) {
        this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.route.navigate([`/${type}`, 'list'], {queryParams: {'keyword': this.keyword}});
            this.resetData();
        });
    }
    
    resetData() {
        this.keyword = '';
    }
    
    resizeWindow() {
        window.addEventListener('resize', this.autoContentHeight);
    }
}
