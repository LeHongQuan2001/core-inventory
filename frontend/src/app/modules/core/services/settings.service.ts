import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BackendService} from "../../../services/backend.service";
import {map} from "rxjs/operators";
import {EncryptService} from "../../../services/encrypt.service";
import {AuthenticationService} from "../../../services/authenticate.service";
import {LocalStorageService} from "../../../services/local-storage.service";
import * as forge from 'node-forge';

@Injectable({
    providedIn: 'root'
})
export class CoreSettingsService {

    protected apiServerPaths = environment.backendServer.paths;

    constructor(private http: HttpClient,
                private apiService: BackendService,
                private authService: AuthenticationService,
                private localStorageService: LocalStorageService,
                private encryptService: EncryptService) {
    }
    
    get(params: any = null) {
        const user = this.authService.currentUserValue;
        if (!user) return false;
        
        const options = {
            params: params,
            headers: {
                Accept: 'application/json'
            }
        };
        
        this.encryptService.genKeys(this.localStorageService.getEncryptKeys());
        options.params.encryptParam = true;
        const path = this.apiServerPaths.core.settings.get;
        return this.apiService.get(path, options, map((result: any) => {
                if (environment.rsa.isActive) {
                    result.data.p = forge.util.encode64(this.encryptService.clientPrivateKey);
                }
                this.localStorageService.setSettings(result.data);
            })
        );
    }
    
    getSettings(params: any = null) {
        const options = {
            params: params,
            headers: {
                Accept: 'application/json'
            }
        };
        
        this.encryptService.genKeys(this.localStorageService.getEncryptKeys());
        options.params.encryptParam = true;
        const path = this.apiServerPaths.core.settings.get;
        return this.apiService.get(path, options, map((result: any) => {
                if (environment.rsa.isActive) {
                    result.data.p = forge.util.encode64(this.encryptService.clientPrivateKey);
                }
                this.localStorageService.setSettings(result.data);
            })
        );
    }
}
