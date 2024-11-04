import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);
        const hasLowerCase = /[a-z]+/.test(value);
        const hasNumeric = /[0-9]+/.test(value);
        const hasSpecialChar = /[^A-Za-z0-9]+/.test(value);

        const passwordValid = value.length >= 8 && hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
        return !passwordValid ? {passwordStrength:true}: null;
    }
}
