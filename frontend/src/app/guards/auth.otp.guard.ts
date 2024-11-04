import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthenticationService } from '../services/authenticate.service';
import {LocalStorageService} from "../services/local-storage.service";

@Injectable({providedIn: 'root'})
export class AuthOtpGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private localStorageService: LocalStorageService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getUserFromLocalStorage();
        if (currentUser && typeof currentUser.verifyOtp !== 'undefined' && currentUser.verifyOtp === true) {
            return true;
        }
        this.router.navigate(['auth', 'otp'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
