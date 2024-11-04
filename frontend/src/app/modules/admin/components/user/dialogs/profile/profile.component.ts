import {Component, OnInit, Inject} from '@angular/core';
import {BaseComponent} from "../../../../../../components/base/base.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdministratorUserService} from "../../../../services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../../../../services/authenticate.service";
import {RoleModel} from 'src/app/modules/admin/models/role.model';
import {ActivatedRoute} from "@angular/router";
import {LocalStorageService} from "../../../../../../services/local-storage.service";

declare const AppNoty: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class AdminUserProfileComponent extends BaseComponent implements OnInit {
    imageSrc: string = './assets/styles/default/images/user-default.png';
    avatar: File | null = null;
    form: FormGroup;
    userInfo: any;
    roles: RoleModel[] = [];
    
    constructor(@Inject(MAT_DIALOG_DATA)
                public data: any,
                private dialogRef: MatDialogRef<AdminUserProfileComponent>,
                public override activatedRoute: ActivatedRoute,
                public override translate: TranslateService,
                private userService: AdministratorUserService,
                private authService: AuthenticationService,
                private fb: FormBuilder,
                private localStorageService: LocalStorageService) {
        super(authService, activatedRoute, translate);
        
        this.userInfo = this.currentUser;
        const user = this.localStorageService.getSettings()?.user || null;
        if (this.currentUser && user && this.currentUser.roleId !== user?.roleId) {
            this.currentUser.roleId = user?.roleId;
            this.currentUser.roleName = user?.roleName;
        }
        
        this.imageSrc = this.userInfo.avatar
            ? this.userInfo.avatar
            : this.imageSrc;
        
        this.form = this.fb.group({
            name: 'avatar',
            avatar: new FormControl(''),
            id: [this.userInfo?.userId, Validators.required],
            username: [this.userInfo?.username, Validators.required],
            email: [this.userInfo?.email, Validators.required]
        });
    }
    
    override ngOnInit(): void {
        this.form.controls['id'].disable();
        this.form.controls['name'].disable();
        this.form.controls['username'].disable();
        this.form.controls['email'].disable();
    }
    
    readURL(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            this.avatar = target.files[0];
            this.form.patchValue({
                avatar: target.files[0],
            });
            const reader = new FileReader();
            reader.readAsDataURL(this.avatar);
            this.updateAvatar();
            return;
        }
        AppNoty.error(this.translate.instant('common.notify.error.message'));
    }
    
    private updateAvatar() {
        const formData: FormData = new FormData();
        formData.append('avatar', this.form.controls['avatar'].value);
        formData.append('name', this.form.controls['name'].value);
        this.userService
            .editAvatar(formData)
            .subscribe((result) => {
                if (result?.status === 1) {
                    this.userInfo.avatar = result.result.data.url;
                    this.authService.setUserInLocalStorage(
                        this.userInfo
                    );
                    this.imageSrc = result.result.data.url;
                    AppNoty.success([this.translate.instant('common.notify.updateSuccess.message')]);
                    return;
                }
            });
    }
    
}
