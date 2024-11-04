import {
    AfterContentInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {RouteModel} from "../../../models/route.model";
import {AuthenticationService} from "../../../../../services/authenticate.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../../../components/base/base.component";
import {ConfirmDialogComponent} from "../../../../../components/_dialogs/confirm.dialog/confirm.dialog.component";
import {PageEvent} from '@angular/material/paginator';
import {Subscription} from "rxjs";
import {RouteService} from "../../../services/route.service";
import {environment} from "../../../../../../environments/environment";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../store/app.state";

declare const AppNoty: any;
declare const commons: any;

@Component({
    selector: 'app-core-route-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class AdminRouteListComponent extends BaseComponent implements OnInit, AfterContentInit, OnDestroy {

    status: any;
    keyword = '';
    length = 0;
    pageIndex = 1;
    pageSize = 30;
    pageSizeOptions: number[] = [10, 30, 50, 100];
    onDestroyRoute: Subscription | undefined;
    routes: RouteModel[] = [];
    displayedColumns: string[] = ['sequence', 'name', 'route', 'uri', 'method'];

    pageEvent: PageEvent = new PageEvent();
    loadingState = false;
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

    @Input() required = false; // Is input requried?
    @Input() type = 'text'; // The type of input element
    @ViewChild('inlineEditControlName') inlineEditControlName!: ElementRef; // input DOM element
    editNameId = '';
    preNameValue = '';

    @ViewChild('inlineEditControlRoute') inlineEditControlRoute!: ElementRef; // input DOM element
    editRouteId = '';
    preRouteValue = '';

    constructor(public override authenticationService: AuthenticationService,
                public override translate: TranslateService,
                private store: Store<AppState>,
                public override activatedRoute: ActivatedRoute,
                private routeService: RouteService,
                private location: Location,
                private dialog: MatDialog) {
        super(authenticationService, activatedRoute, translate);

        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.keyword = params.keyword ?? '';
            this.pageSize = params.limit ?? this.pageSize;
            this.pageIndex = params.page ?? this.pageIndex;
        });
    }

    override ngOnInit(): void {
        this.getData();
    }

    ngAfterContentInit() {
    
    }

    getData() {
        const queries: any = {};
        if (this.pageIndex > 0) {
            queries.page = this.pageIndex;
        }
        if (this.pageSize > 0) {
            queries.limit = this.pageSize;
        }
        if (this.keyword !== '') {
            queries.keyword = encodeURIComponent(this.keyword);
        }
        this.onDestroyRoute = this.routeService.get(queries).subscribe(result => {
            this.routes = result.data || [];
            this.length = result.count;
        });

        const params = [];
        // tslint:disable-next-line:forin
        for (const i in queries) {
            params.push(i + '=' + queries[i]);
        }

        this.location.replaceState('/' + environment.administratorPrefix + '/route/search', params.join('&'));
    }
    
    getPaginator(event: any) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getData();
    }

    importRoute = () => {
        this.routeService.import().subscribe(response => {
            AppNoty.success([this.translate.instant('common.notify.success.message')]);
            this.getData();
        });
    }

    openDialogSync = () => {
        this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            disableClose: false
        });

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.importRoute();
            }
            this.confirmDialogRef = undefined;
        });
    }

    public override ngOnDestroy(): void {
        if (this.onDestroyRoute) {
            this.onDestroyRoute.unsubscribe();
        }
    }

    editName(value: any, route: any) {
        this.preNameValue = value;
        this.editNameId = route.id;
        // Focus on the input element just as the editing begins
        setTimeout(() => {
            this.inlineEditControlName.nativeElement.focus()
        });
    }

    saveName(route: any) {
        if (route == null) {
            return
        }
        const routeId = route.id
        const name = this.inlineEditControlName.nativeElement.value
        const index = this.routes.findIndex((e: any) => e.id === routeId);
        this.editNameId = '';
        this.routes[index].name = name;

        const data = {
            name: name
        }

        this.routeService.update(routeId, data).subscribe((result: any) => {
            commons.notify.success(
                this.translate.instant('common.notify.success.title'),
                this.translate.instant('common.notify.success.message')
            );

            if (typeof index !== 'undefined') {
                this.routes[index].name = name;
            }
        });
    }

    @HostListener('keypress', ['$event'])
    onKeyPressName(event: any, route: any) {
        if (event.key === 'Enter') {
            this.saveName(route);
        }
    }

    editRoute(value: any, route: any) {
        this.preRouteValue = value;
        this.editRouteId = route.id;
        // Focus on the input element just as the editing begins
        setTimeout(() => {
            this.inlineEditControlRoute.nativeElement.focus()
        });
    }

    saveRoute(route: any) {
        if (route == null) {
            return
        }
        const routeId = route.id
        const routeString = this.inlineEditControlRoute.nativeElement.value
        this.editRouteId = '';

        const data = {
            route: routeString
        }

        this.routeService.update(routeId, data).subscribe((result: any) => {
            commons.notify.success(
                this.translate.instant('common.notify.success.title'),
                this.translate.instant('common.notify.success.message')
            );

            const index = this.routes.findIndex((e: any) => e.id === routeId);
            if (typeof index !== 'undefined') {
                this.routes[index].route = routeString;
            }
        });
    }

    @HostListener('keypress', ['$event'])
    onKeyPressRoute(event: any, route: any) {
        if (event.key === 'Enter') {
            this.saveRoute(route);
        }
    }
}
