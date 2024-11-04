import {Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class RuleCheckerService {
    
    routes: any;
    user: any;
    settings: any;
    
    constructor(private localStorageService: LocalStorageService) {
        this.routes = this.localStorageService.getSettings()?.routes || [];
        this.user = this.localStorageService.getCurrentUser();
    }
    
    isAllow(routeName: string): any {
        if (this.user.roleId === environment.roles.superAdmin) {
            return true;
        }
        const route = this.routes.find((e: any) => e.route === routeName || e.route === `/${routeName}`)
        return typeof route !== 'undefined' && route.allow === true;
    }
    
    initRule() {
        this.settings = this.localStorageService.getSettings() ?? null;
        this.user = this.localStorageService.getCurrentUser();
        if (this.user.roleId === environment.roles.superAdmin) {
            return;
        }
        if (this.settings === null) {
            location.reload();
        }
    }
}
