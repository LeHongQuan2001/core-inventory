import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthenticationService } from '../services/authenticate.service';
import {GrowthBookService} from "../services/growth-book.service";

@Injectable({providedIn: 'root'})
export class GrowthBookFeatureFlagGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private growthBookService: GrowthBookService
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getUserFromLocalStorage();
        const feature = route.data['growthBook'].feature || false;
        if (!feature) {
            return true;
        }
        //if (this.growthBookService.setAttribute(currentUser).isOn(feature)) {
        if (this.growthBookService.isOn(feature)) {
            return true;
        }

        this.router.navigate(['/', 'error', '403.html']);
        return false;
    }
}
