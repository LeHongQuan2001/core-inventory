import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {RuleCheckerService} from "../../../services/rule-checker.service";

@Injectable({providedIn: 'root'})
export class CoreRuleCheckerGuard implements CanActivate {
    constructor(
        private router: Router,
        private ruleCheckerService: RuleCheckerService
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const routePath = route.data['route'] || false;
        if (!route) {
            return true;
        }


        if (this.ruleCheckerService.isAllow(routePath)) {
            return true;
        }

        this.router.navigate(['/', 'error', '403.html']);
        return false;
    }
}
