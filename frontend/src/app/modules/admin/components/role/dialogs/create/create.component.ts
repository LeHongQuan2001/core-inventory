import {AfterViewInit, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../../../../../components/base/base.component";
import {RoleModel} from "../../../../models/role.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../../../../services/role.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../../../../services/authenticate.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../../store/app.state";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime} from "rxjs";
import {ActivatedRoute} from "@angular/router";

declare const $: any;
declare const AppNoty: any;

function noWhitespaceValidator(control: { value: string }): { [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? {'whitespace': true} : null;
}

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})


export class AdminRoleCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
    loadingState = false;
    role: RoleModel = new RoleModel({});
    statuses = [];
    listPermissionLocked = [];
    onSave = new EventEmitter();
    formCreateRole: FormGroup;
    errors = {
        name: false
    }

    constructor(@Inject(MAT_DIALOG_DATA)
                public data: any,
                public override authenticationService: AuthenticationService,
                public override activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                public override translate: TranslateService,
                private dialogRef: MatDialogRef<AdminRoleCreateComponent>,
                private roleService: RoleService,
                private store: Store<AppState>) {
        super(authenticationService, activatedRoute, translate);
        dialogRef.disableClose = true;

        this.dialogRef.keydownEvents().subscribe(event => {
            if (event.key === "Escape") {
                this.dialogRef.close();
            }
        });

        this.statuses = data.statuses;
        this.listPermissionLocked = data.listPermissionLocked;
        this.role.status = 1;
        this.role.permissionLocked = 0;

        this.formCreateRole = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), noWhitespaceValidator]],
        });

        this.formCreateRole.controls['name'].valueChanges.pipe(debounceTime(300))
            .subscribe((value) => {
                this.checkNameExist(value);
            });
    }

    override ngOnInit(): void {
    }

    ngAfterViewInit() {
        $('.role-create-statuses').select2({}).on("select2:select", (e: any) => {
            const status = e.params.data.id;
            this.role.status = parseInt(status);
        });
        $('.role-create-permission-locked').select2({}).on("select2:select", (e: any) => {
            const status = e.params.data.id;
            this.role.permissionLocked = parseInt(status);
        });
    }

    checkNameExist(name: any) {
        if (this.formCreateRole.invalid) {
            return;
        }
        this.errors.name = false;
        this.roleService.checkNameExist(name).subscribe(result => {
            if (result.count > 0) {
                this.errors.name = true;
            }
        });
    }

    saveRoleInfo() {
        if (this.formCreateRole.invalid) {
            return;
        }
        this.loadingState = true;
        this.role.name = this.formCreateRole.controls['name'].value;
        this.roleService.create(this.role).subscribe((result: any) => {
            console.log('result', result);
            this.loadingState = false;
            if (result.status == 1) {
                this.role = result;
                AppNoty.success([this.translate.instant('common.notify.createSuccess.message')]);
                this.dialogRef.close(true);
                return;
            }
            AppNoty.success([this.translate.instant('common.notify.error.message')]);
        });
    }
}
