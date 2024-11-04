import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from 'src/app/components/base/base.component';
import {PasswordValidation} from 'src/app/modules/admin/services/password-validation';
import {AdministratorPasswordService} from 'src/app/modules/admin/services/password.service';
import {AdministratorUserService} from 'src/app/modules/admin/services/user.service';
import {AuthenticationService} from 'src/app/services/authenticate.service';
import {environment} from "../../../../../../../environments/environment";
import { Subscription } from 'rxjs';

declare const $: any;
declare const AppNoty: any;

@Component({
    selector: 'app-admin-create-user',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class AdminCreateUserComponent extends BaseComponent implements OnInit, AfterViewInit {
    listAppsOfUser: any[] = [];
    userForm!: FormGroup;
    dataAppIds: number[] = [];
    domains: [] = [];
    loadingState = false;
    roles: any;
    role: any;
    pageIndex = 0;
    pageSize = 50;
    length = 0;
    statuses: [] = [];
    domainIsValid = true;
    isShowPassword = false;
    subscribeApps!: Subscription;
    apps: any[] = [];
    constructor(@Inject(MAT_DIALOG_DATA)
                public data: any,
                private dialogRef: MatDialogRef<AdminCreateUserComponent>,
                public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private formBuilder: FormBuilder,
                private userService: AdministratorUserService,
                private passwordService: AdministratorPasswordService) {
        super(authenticationService, activatedRoute, translate);
        dialogRef.disableClose = true;
        this.apps = this.data.apps;
        this.dialogRef.keydownEvents().subscribe(event => {
            if (event.key === "Escape") {
                this.dialogRef.close();
            }
        });

        this.domains = [];
        this.roles = data.roles.filter((e: any) => this.currentUser && e.id !== this.currentUser.roleId);
        this.statuses = data.statuses;
    }

    ngAfterViewInit(): void {
    }

    override ngOnInit() {
        this.createFormUser();
        this.initSelect2();
    }

    noWhitespaceValidator(control: { value: string }): { [key: string]: boolean } | null {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? {'whitespace': true} : null;
    }

    createFormUser() {
        this.userForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,30}$/)]],
            confirmPassword: [''],
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.noWhitespaceValidator]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.noWhitespaceValidator]],
            email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
            phone: [''],
            status: [1, [Validators.required]],
            roleId: [, [Validators.required]],
            domains: ['', [Validators.required]]
        }, {
            validator: PasswordValidation.MatchPassword
        });
    }

    generatePassword() {
        const password = this.passwordService.generate(12);
        this.userForm.controls['password'].setValue(password);
        this.userForm.controls['confirmPassword'].setValue(password)
    }

    initSelect2() {
        setTimeout(() => {
            $('.user-update-role')
                .select2({
                    minimumResultsForSearch: Infinity,
                    width: '100%',
                })
                .on('select2:select', (e: any) => {
                    const data = e.params.data;
                    // tslint:disable-next-line:radix
                    this.userForm.controls['roleId'].setValue(data.id);
                    if (this.userForm.controls['roleId'].value !== environment.roles.superAdmin
                        && this.userForm.controls['roleId'].value !== environment.roles.admin
                        && this.userForm.controls['roleId'].value !== environment.roles.dmpAdmin
                        && this.dataAppIds.indexOf(-1) !== -1) {
                        $(".notify-group-select-apps").empty();
                        this.dataAppIds = []
                        this.listAppsOfUser = [];
                    }
                });

            $('.user-update-statuses')
                .select2({
                    minimumResultsForSearch: Infinity,
                    width: '100%',
                })
                .on('select2:select', (e: any) => {
                    const data = e.params.data;
                    // tslint:disable-next-line:radix
                    // this.user.status = parseInt(data.id);'
                    this.userForm.controls['status'].setValue(data.id);
                });

            const component = this;
            let dataApps = [{
                id: -1,
                text: this.translate.instant('modules.admin.user.common.selectAllApps'),
                selected: false
            }];
            for (const item of this.apps) {
                dataApps.push({
                    id: item.id,
                    text: `${item.domain} - #${item.id}`,
                    selected: false
                })
            }
            $('.notify-group-select-apps').select2({
                data: dataApps,
                placeholder: this.translate.instant('modules.admin.user.common.selectApps'),
                language: {
                    inputTooShort: () => {
                        return component.translate.instant('modules.admin.user.common.selectApps');
                    },
                    searching: () => {
                        return component.translate.instant('common.loading');
                    },
                    noResults: () => {
                        return component.translate.instant('common.dataNotFound');
                    }
                },
                closeOnSelect: false,
                escapeMarkup: function (markup: any) {
                    return markup;
                }, // let our custom formatter work
                minimumResultsForSearch: 10,
                minimumInputLength: 0,
            }).on("select2:select", (e: any) => {
                const value = parseInt(e.params.data.id);
                if (value === -1) {
                    dataApps = dataApps.map(e => {return {...e, selected: true}})
                    this.dataAppIds = [value];
                    $('.select2-results__option').attr('aria-selected', 'true');
                    $(".notify-group-select-apps").val(this.dataAppIds).trigger("change");
                } else {
                    this.dataAppIds = this.dataAppIds.filter(e => e !== -1);
                    this.dataAppIds.push(value);
                    if (this.dataAppIds.length === dataApps.length - 1) {
                        this.dataAppIds = [-1]
                        $('.select2-results__option').eq(0).attr('aria-selected', 'true');
                    } else {
                        $('.select2-results__option').eq(0).attr('aria-selected', 'false')
                    }
                    $(".notify-group-select-apps").val(this.dataAppIds).trigger("change");
                }
                this.userForm.controls['domains'].setValue(this.dataAppIds);
                this.domainIsValid = this.userForm.controls['domains'].valid;
            }).on("select2:unselect", (e: any) => {
                const value = parseInt(e.params.data.id);
                if (value === -1) {
                    dataApps = dataApps.map(e => {return {...e, selected: false}});
                    $('.notify-group-select-apps').empty().select2({
                        data: dataApps,
                        placeholder: this.translate.instant('modules.admin.user.common.selectApps'),
                        language: {
                            inputTooShort: () => {
                                return component.translate.instant('modules.admin.user.common.selectApps');
                            },
                            searching: () => {
                                return component.translate.instant('common.loading');
                            },
                            noResults: () => {
                                return component.translate.instant('common.dataNotFound');
                            }
                        },
                        closeOnSelect: false,
                        escapeMarkup: function (markup: any) {
                            return markup;
                        }, // let our custom formatter work
                        minimumResultsForSearch: 10,
                        minimumInputLength: 0,
                    })
                    $('.notify-group-select-apps').select2("open")
                    this.dataAppIds = [];
                    $('.select2-results__option').attr('aria-selected', 'false');
                } else {
                    $('.select2-results__option').eq(0).attr('aria-selected', 'false');
                    const arrNotAll = $('.notify-group-select-apps').val().filter((e: any) => e !== '-1');
                    $('.notify-group-select-apps').val(arrNotAll).trigger('change');
                    this.dataAppIds = this.dataAppIds.filter(item => {
                        return item != value
                    });
                }
                this.userForm.controls['domains'].setValue(this.dataAppIds);
                this.domainIsValid = this.userForm.controls['domains'].valid;
            }).on("select2:closing", (e: any) => {
                this.domainIsValid = this.userForm.controls['domains'].valid;
            });
        }, 200);
    }

    saveUserInfo() {
        const encryptBody = this.environment.rsa.isActive || false;
        if (this.userForm.valid) {
            this.userService.create(this.userForm.value, encryptBody).subscribe((result) => {
                if (result.status === 1) {
                    AppNoty.success([this.translate.instant('modules.admin.user.notify.createUserSucess')]);
                    this.dialogRef.close(true);
                    return;
                }

                AppNoty.error([this.translate.instant(result.message ? 'modules.admin.user.notify.' + result.message : 'modules.admin.user.notify.createUserFailed')]);
            })
        }
    }

    changePhone(event: any) {
        const phoneControl = this.userForm.get('phone');
        if (phoneControl) {
            if (event.target.value.length === 0) {
                phoneControl.clearValidators();
            } else {
                phoneControl.setValidators([Validators.pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)]);
            }

            phoneControl.updateValueAndValidity();
        }
    }
}
