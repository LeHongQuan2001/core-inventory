import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthenticationService } from '../services/authenticate.service';
import {LocalStorageService} from "../services/local-storage.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private localStorageService: LocalStorageService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getUserFromLocalStorage();
        const date = new Date();
        if (currentUser && (new Date(currentUser.expirationDate)).getTime() > date.getTime()) {
            return true;
        } else {
            /**
             * Clear localStorage if token has been expired
             */
            this.localStorageService.removeUser();
        }

        //
        // not logged in so redirect to login page with the return url
        this.router.navigate(['auth', 'login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
