import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthenticationService } from '../services/authenticate.service';
import {LocalStorageService} from "../services/local-storage.service";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private localStorageService: LocalStorageService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getUserFromLocalStorage();
        const roles = [environment.roles.superAdmin, environment.roles.admin];
        if (currentUser && roles.indexOf(currentUser.roleId) >= 0) {
            return true;
        }

        this.router.navigate(['/', 'error', '403.html']);
        return false;
    }
}
