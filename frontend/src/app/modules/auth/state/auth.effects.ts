import {
    setLoadingSpinner,
    setErrorMessage,
    setSuccessMessage
} from '../../../store/shared/shared.actions';
import { AuthenticationService } from '../../../services/authenticate.service';
import { exhaustMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import {
    autoLogin,
    autoLogout, loginFail,
    loginStart,
    loginSuccess, otpVerifyFail, otpVerifyStart, otpVerifySuccess,
    signupStart,
    signupSuccess,
} from './auth.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from "../../../../environments/environment";
import {CoreSettingsService} from "../../core/services/settings.service";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthenticationService,
        private store: Store<AppState>,
        private router: Router,
        private settingsService: CoreSettingsService
    ) {}

    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loginStart),
            exhaustMap((action) => {
                const encryptBody = environment.rsa.isActive || false;
                return this.authService.login(action.username, action.password, encryptBody).pipe(
                    map((response: any) => {
                        const data = response.data || false;
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        if (data) {
                            this.store.dispatch(setErrorMessage({message: ''}));
                            const user = this.authService.formatUser(data.user);
                            this.authService.setUserInLocalStorage(user);
                            return loginSuccess({user, redirect: true});
                        } else {
                            return loginFail({ reason: response.message || null });
                        }
                    }),
                    catchError((errResp) => {
                        this.store.dispatch(setLoadingSpinner({ status: false }));
                        const errorMessage = this.authService.getErrorMessage(
                            errResp.error.message
                        );
                        return of(setErrorMessage({ message: errorMessage }));
                    })
                );
            })
        );
    });

    loginRedirect$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(...[loginSuccess, signupSuccess, otpVerifySuccess]),
                tap((action) => {
                    this.store.dispatch(setErrorMessage({ message: '' }));
                    if (action.redirect) {
                        this.settingsService.getSettings({}).subscribe(() => {
                            this.router.navigate(['/', 'home']);
                        })
                    }
                })
            );
        },
        { dispatch: false }
    );

    loginFail$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(...[loginFail]),
                tap((action) => {
                    this.store.dispatch(setErrorMessage({ message: action.reason }));
                })
            );
        },
        { dispatch: false }
    );

    autoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(autoLogin),
            mergeMap((action) => {
                const user = this.authService.getUserFromLocalStorage();
                // @ts-ignore
                return of(loginSuccess({ user, redirect: false }));
            })
        );
    });

    logout$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(autoLogout),
                map((action) => {
                    this.authService.logout();
                    return this.router.navigate(['/', 'auth', 'login']);
                })
            );
        },
        { dispatch: false }
    );
}
