import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, EMPTY, from, Observable, of} from "rxjs";
import {map, concatMap, finalize} from "rxjs/operators";
import { environment } from 'src/environments/environment';
import {FacebookAccountModel} from "../models/facebook.account.model";

declare const FB: any;

// @ts-ignore
const baseUrl = `${environment?.apiUrl}/accounts`;

@Injectable({
    providedIn: 'root'
})
export class AuthenticateFacebookService {

    private accountSubject: BehaviorSubject<FacebookAccountModel>;
    private authenticateTimeout: any;
    public account: Observable<FacebookAccountModel>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
        // @ts-ignore
        this.accountSubject = new BehaviorSubject<FacebookAccountModel>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): FacebookAccountModel {
        return this.accountSubject.value;
    }

    fbLogin() {
        // login with facebook and return observable with fb access token on success
        // @ts-ignore
        return from(new Promise<fb.StatusResponse>(resolve => FB.login(resolve)))
            .pipe(concatMap(({ authResponse }) => {
                if (!authResponse) return EMPTY;
                return of(authResponse.accessToken);
            }));
    }

    login() {
        this.fbLogin()
            .pipe(concatMap(accessToken => this.apiAuthenticate(accessToken)))
            .subscribe(() => {
                // get return url from query parameters or default to home page
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl);
            });
    }

    apiAuthenticate(accessToken: string) {
        // authenticate with the api using a facebook access token,
        // on success the api returns an account object with a JWT auth token
        return this.http.post<any>(`${baseUrl}/authenticate`, { accessToken })
            .pipe(map(account => {
                this.accountSubject.next(account);
                this.startAuthenticateTimer();
                return account;
            }));
    }

    logout() {
        // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
        FB.api('/me/permissions', 'delete', null, () => FB.logout());
        this.stopAuthenticateTimer();
        // @ts-ignore
        this.accountSubject.next(null);
        this.router.navigate(['/login']);
    }

    getAll() {
        return this.http.get<FacebookAccountModel[]>(baseUrl);
    }

    getById(id: any) {
        return this.http.get<FacebookAccountModel>(`${baseUrl}/${id}`);
    }

    private startAuthenticateTimer() {
        // parse json object from base64 encoded jwt token
        // @ts-ignore
        const jwtToken = JSON.parse(atob(this.accountValue.token.split('.')[1]));

        // set a timeout to re-authenticate with the api one minute before the token expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        const { accessToken } = FB.getAuthResponse();
        this.authenticateTimeout = setTimeout(() => {
            this.apiAuthenticate(accessToken).subscribe();
        }, timeout);
    }

    private stopAuthenticateTimer() {
        // cancel timer for re-authenticating with the api
        clearTimeout(this.authenticateTimeout);
    }
}
