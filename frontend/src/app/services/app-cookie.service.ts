import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {CookieService} from "ngx-cookie-service";

@Injectable({providedIn: 'root'})
export class AppCookieService {

    protected prefix = environment.appPrefix;

    protected authToken = '__app-AUTH-TOKEN';
    protected authRefreshToken = '__app-AUTH-REFRESH-TOKEN';
    protected deviceId = '__app-DEVICE-ID';

    constructor(private cookieService: CookieService) { }

    public getKeyName(key: string) {
        return `${key}`;
    }

    public setAuth(accessToken: string, refreshToken: string,  expires = 7) {
        // set(name: string, value: string, expires?: CookieOptions['expires'], path?: CookieOptions['path'], domain?: CookieOptions['domain'], secure?: CookieOptions['secure'], sameSite?: SameSite): void;
        this.cookieService.set(this.getKeyName(this.authToken), accessToken, {
            expires: expires,
            path: '/',
            secure: true,
            sameSite: 'Strict'
        });
        this.cookieService.set(this.getKeyName(this.authRefreshToken), refreshToken, {
            expires: expires,
            path: '/',
            secure: true,
            sameSite: 'Strict'
        })
    }

    public getAuth() {
        return this.cookieService.get(this.getKeyName(this.authToken));
    }

    public setDeviceId(deviceId: string, expires = 7) {
        this.cookieService.set(this.getKeyName(this.deviceId), deviceId, {
            expires: expires,
            path: '/',
            secure: true,
            sameSite: 'Strict'
        })
    }

    public getDeviceId() {
        return this.cookieService.get(this.getKeyName(this.deviceId));
    }

    public clear() {
        this.cookieService.delete(this.authToken);
        this.cookieService.delete(this.authRefreshToken);
    }
}
