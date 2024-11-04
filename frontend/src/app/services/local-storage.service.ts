import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {EncryptService} from "./encrypt.service";
import * as forge from 'node-forge';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

    protected prefix = environment.appPrefix;

    protected locale = 'en';

    protected userKey = 'current_user';

    protected settingsKey = 'settings';
    
    protected encryptKey = 'keys';

    private isActiveRsa = environment.rsa.isActive;

    constructor(private encryptService: EncryptService) {
    }

    public getKeyName(key: string) {
        return `${this.prefix}${key}`;
    }

    public setLang(lang: any) {
        localStorage.setItem(this.getKeyName('lang'), lang);
    }

    public get(key: string) {
        return localStorage.getItem(this.getKeyName(key));
    }

    public set(key: string, value: string) {
        return localStorage.setItem(this.getKeyName(key), value);
    }

    public delete(key: string) {
        return localStorage.removeItem(this.getKeyName(key));
    }

    public getLocale() {
        let locale = this.get('lang');
        locale = locale ? locale : environment.locale.default;
        this.setLocale(locale);
        this.locale = locale;
        return this.locale;
    }

    public setLocale(locale: string) {
        localStorage.setItem(this.getKeyName('lang'), locale);
    }

    public getCurrentUser() {
        const currentUser = this.get(this.userKey);
        return currentUser ? JSON.parse(currentUser) : null;
    }


    public setUser(user: User) {
        return localStorage.setItem(this.getKeyName(this.userKey), JSON.stringify(user));
    }

    public setItem(data: any, key: any) {
        return localStorage.setItem(this.getKeyName(key), JSON.stringify(data));
    }

    public removeUser() {
        return localStorage.removeItem(this.getKeyName(this.userKey));
    }

    setSettings(data: any) {
        return localStorage.setItem(this.getKeyName(this.settingsKey), JSON.stringify(data));
    }
    
    setEncryptKeys(keys: any) {
        return localStorage.setItem(this.getKeyName(this.encryptKey), btoa(JSON.stringify(keys)));
    }
    
    getEncryptKeys() {
        const keys = localStorage.getItem(this.getKeyName(this.encryptKey));
        return keys ? JSON.parse(atob(keys)) : null;
    }

    getSettings() {
        const dataEncrypt = localStorage.getItem(this.getKeyName(this.settingsKey));
        const data = dataEncrypt ? JSON.parse(dataEncrypt) : null;
        if (!data) return null;
        if (!this.isActiveRsa) {
            return data;
        }
        this.encryptService.clientPrivateKey = forge.util.decode64(data.p);
        return data ? JSON.parse(this.encryptService.decryptResponse(data)) : false;
    }

    public remove(key: any) {
        return localStorage.removeItem(this.getKeyName(key));
    }
}
