import {AbstractControl} from '@angular/forms';

export class PasswordValidation {
    
    // @ts-ignore
    static MatchPassword(AC: AbstractControl) {
        // @ts-ignore
        AC.get('confirmPassword').setErrors(null);
        // @ts-ignore
        const password = AC.get('password')?.value ?? AC.get('newPassword')?.value;
        // @ts-ignore
        const confirmPassword = AC.get('confirmPassword').value;
        // tslint:disable-next-line:triple-equals
        if (password && password != confirmPassword) {
            // @ts-ignore
            AC.get('confirmPassword').setErrors({MatchPassword: true});
        } else {
            return null;
        }
    }
}
