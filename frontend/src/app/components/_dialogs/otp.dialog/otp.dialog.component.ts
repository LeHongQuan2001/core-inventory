import {AfterViewInit, Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-otp.dialog',
    templateUrl: './otp.dialog.component.html',
    styleUrls: ['./otp.dialog.component.scss']
})
export class OtpDialogComponent implements AfterViewInit {

    public title: string;

    public message: string;

    callback: any;

    formOTP: FormGroup;

    @ViewChild('digitOne') digitOne !: ElementRef;
    @ViewChild('digitSix') digitSix !: ElementRef;

    constructor(public translation: TranslateService,
                public dialogRef: MatDialogRef<OtpDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder) {
        this.title = data?.title ?? this.translation.instant('common.otp');
        this.callback = data?.callback || null;
        this.message = data?.message ?? this.translation.instant('common.otpMessageSendOtpEmail');

        this.formOTP = this.fb.group({
            //otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            digitOne: ['', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]{1}$")]],
            digitTwo: ['', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]{1}$")]],
            digitThree: ['', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]{1}$")]],
            digitFour: ['', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]{1}$")]],
            digitFive: ['', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]{1}$")]],
            digitSix: ['', [Validators.required, Validators.maxLength(1), Validators.pattern("^[0-9]{1}$")]]
        });
    }

    ngAfterViewInit() {
        this.digitOne.nativeElement.focus();
    }

    onDigitInput(event: any) {
        let element;
        if (event.code !== 'Backspace' && event.target.value) {
            element = event.srcElement.nextElementSibling;
        }

        if (event.code === 'Backspace') {
            element = event.srcElement.previousElementSibling;
        }

        if (element == null) {
            event.srcElement.blur();
            return;
        } else {
            element.focus();
        }

        if (!this.checkFormInValid()) {
            this.onSubmit();
        }
    }

    onDigitPaste(event: any) : boolean {
        const pasteValue = event && event.clipboardData ? event.clipboardData.getData('text') : '';
        if (pasteValue.length != 6 || !(/[0-9]+/g).test(pasteValue)) {
            this.digitOne.nativeElement.focus();
            return false;
        }

        this.formOTP.patchValue({
            digitOne: pasteValue[0],
            digitTwo: pasteValue[1],
            digitThree: pasteValue[2],
            digitFour: pasteValue[3],
            digitFive: pasteValue[4],
            digitSix: pasteValue[5]
        });
        this.digitSix.nativeElement.focus();
        if (!this.checkFormInValid()) {
            this.onSubmit();
        }

        return true;
    }

    onDigitChange(event: any) {
        if (!this.checkFormInValid()) {
            this.onSubmit();
        }
    }

    checkFormInValid() {
        return this.formOTP.invalid;
    }

    onSubmit() {
        const digitOne = this.formOTP.value.digitOne;
        const digitTwo = this.formOTP.value.digitTwo;
        const digitThree = this.formOTP.value.digitThree;
        const digitFour = this.formOTP.value.digitFour;
        const digitFive = this.formOTP.value.digitFive;
        const digitSix = this.formOTP.value.digitSix;
        const code = `${digitOne}${digitTwo}${digitThree}${digitFour}${digitFive}${digitSix}`;
        if (this.callback) {
            this.callback({
                otp: code
            });
        }
    }
}
