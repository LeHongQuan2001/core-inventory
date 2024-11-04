import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from "../../../../../../components/base/base.component";
import { AclModel } from "../../../../models/acl.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdministratorPermissionService } from "../../../../services/permission.service";
import { AdministratorUserService } from "../../../../services/user.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../../../../../../services/authenticate.service";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { UserModel } from 'src/app/modules/admin/models/user.model';
import { ActivatedRoute } from "@angular/router";
import { PasswordValidation } from "../../../../services/password-validation";
import { environment } from "../../../../../../../environments/environment";
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

declare const $: any;
declare const AppNoty: any;

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss']
})

export class AdminUserPermissionComponent extends BaseComponent implements OnInit, AfterViewInit {
    objectType = 'user';
    title = 'User Permission';
    user: UserModel = new UserModel();
    loadingState = false;
    acl: AclModel[] = [];
    aclAll: AclModel[] = [];
    aclAllow: AclModel[] = [];
    aclDeny: AclModel[] = [];
    domains: [] = [];
    pageIndex = 0;
    pageSize = 50;
    length = 0;
    roles: any;
    role: any;
    statuses: [] = [];
    visible = true;
    domainCtrl = new FormControl();
    addOnBlur = false;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('domainInput') domainInput: ElementRef<HTMLInputElement> | undefined;
    @ViewChild('auto') matAutocomplete: MatAutocomplete | undefined;
    @ViewChild('keyword') keyword: ElementRef | undefined;
    @ViewChild('groupUserInput') groupUserInput: ElementRef<HTMLInputElement> | undefined;
    packages: [] = [];
    package = '';
    tabCurrent = 'permission-tab-role-info';
    isShowPassword = false;
    listAppsOfUser: any[] = [];
    userForm!: FormGroup;
    dataAppIds: number[] = [];
    subscribeGroup!: Subscription;
    groups: any;
    groupUserExist: any[] = [];
    groupUserSelected: any[] = [];
    permissionSelected: any[] = [];
    focusGroupUser = false;
    appPermission: any[] = [];
    displayGroupUser = false;
    preventBlurFlag = false;
    appList: any[] = [];
    constructor(@Inject(MAT_DIALOG_DATA)
    public data: any,
        private dialogRef: MatDialogRef<AdminUserPermissionComponent>,
        public override authenticationService: AuthenticationService,
        public override activatedRoute: ActivatedRoute,
        public override translate: TranslateService,
        private permissionService: AdministratorPermissionService,
        private formBuilder: FormBuilder,
        private userService: AdministratorUserService) {
        super(authenticationService, activatedRoute, translate);

        dialogRef.disableClose = true;

        this.dialogRef.keydownEvents().subscribe(event => {
            if (event.key === "Escape") {
                this.dialogRef.close();
            }
        });
       
        this.domains = [];
        this.roles = data.roles;
        this.user = JSON.parse(JSON.stringify(data.user));
        this.statuses = data.statuses;
        this.getData();
    }

    override ngOnInit() {
        this.createFormUser();
        this.initSelect2();
    }

    ngAfterViewInit() {
    }

    createFormUser() {
        this.userForm = this.formBuilder.group({
            password: ['', [Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,30}$/)]],
            confirmPassword: [''],
            mobile: ['', [Validators.pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)]]
        }, {
            validator: PasswordValidation.MatchPassword
        });
    }

    initSelect2() {
        setTimeout(() => {
            $('.user-update-role')
                .select2({
                    minimumResultsForSearch: Infinity,
                    width: '300px',
                })
                .on('select2:select', (e: any) => {
                    const data = e.params.data;
                    // tslint:disable-next-line:radix
                    this.user.roleId = parseInt(data.id);
                    if (this.user.roleId !== environment.roles.superAdmin
                        && this.user.roleId !== environment.roles.admin
                        && this.user.roleId !== environment.roles.dmpAdmin
                        && this.dataAppIds.indexOf(-1) !== -1) {
                        $(".notify-group-select-apps").empty();
                        this.dataAppIds = []
                        this.listAppsOfUser = [];
                    }
                });

            $('.user-update-statuses')
                .select2({
                    minimumResultsForSearch: Infinity,
                    width: '300px',
                })
                .on('select2:select', (e: any) => {
                    const data = e.params.data;
                    // tslint:disable-next-line:radix
                    this.user.status = parseInt(data.id);
                });
        }, 100);
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.domains = [];
        // @ts-ignore
        this.domains.push(event.option.value);
        // @ts-ignore
        this.domainInput.nativeElement.value = '';
        this.domainCtrl.setValue(null);
    }

    public checkFormInvalid() {
        return this.userForm.invalid;
    }

    public saveUserInfo() {
        if (!this.checkFormInvalid()) {
            const encryptBody = this.environment.rsa.isActive || false;
            if (this.userForm.value.password) {
                if (this.userForm.invalid) {
                    return;
                }
            }
            const password = this.userForm.value.password;
            const confirmPassword = this.userForm.value.confirmPassword;
            this.loadingState = true;
            const body = JSON.parse(JSON.stringify(this.user));
            body.apps = this.dataAppIds;
            body.mobile = this.userForm.value.mobile;
            body.telegramChatId = this.userForm.value.telegramId;

            this.userService.update(body, '', password, confirmPassword, encryptBody).subscribe(result => {
                this.loadingState = false;
                if (result.status === 1) {
                    this.getData();
                    this.dialogRef.close(true);
                    AppNoty.success([this.translate.instant('common.notify.success.message')]);
                    this.groupUserSelected = [];
                    return;
                }
                AppNoty.error(this.translate.instant('common.notify.error.message'));
            });
        }
    }

    private getData() {
        this.permissionService.details(this.objectType, this.user.id).subscribe(result => {
            this.acl = result.data.routes.all.length > 0 ? result.data.routes.all : [];
            this.aclAll = this.acl;
            this.aclAllow = result.data.routes.allow.length > 0 ? result.data.routes.allow : [];
            this.aclDeny = result.data.routes.deny.length > 0 ? result.data.routes.deny : [];
            this.length = result.count;
            this.domains = result.data.domains;
            this.packages = result.data.packages;
        });
    }

    public filterRoutes($event: any) {
        this.aclAll = this.acl.filter(e => {
            // @ts-ignore
            const keyword = this.keyword.nativeElement.value.trim();
            const keywordResult = keyword === '' ? true
                : (keyword && (e.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
                    || e.uri.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) ? true : (keyword === ''));
            const packageResult = this.package === '' ? true
                : (this.package && this.package === (e.vendor + ' / ' + e.package) ? true : false);
            return keywordResult && packageResult;
        });
    }

    public toggle(event: MatSlideToggleChange, acl: AclModel) {
        this.loadingState = true;
        this.permissionService.set(this.objectType, this.user.id, acl, event.checked).subscribe(result => {
            this.loadingState = false;
            if (result.status === 1) {
                acl.isAllow = result?.data?.allow;
                if (acl.isAllow) {
                    this.aclAllow.push(acl);
                    const index = this.aclDeny.indexOf(acl);
                    this.aclDeny.splice(index, 1);
                } else {
                    this.aclDeny.push(acl);
                    const index = this.aclAllow.indexOf(acl);
                    this.aclAllow.splice(index, 1);
                }
                AppNoty.success([this.translate.instant('common.notify.success.message')]);
                return;
            }
            AppNoty.error(this.translate.instant('common.notify.error.message'));
        });
    }

    preventBlur(event: any) {
        event.preventDefault();
    }
}
