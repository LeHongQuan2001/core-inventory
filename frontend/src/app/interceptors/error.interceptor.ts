import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import { AuthenticationService } from '../services/authenticate.service';
import {AppState} from "../store/app.state";
import { Store } from '@ngrx/store';
import {setLoadingSpinner} from "../store/shared/shared.actions";
import {Router} from "@angular/router";

declare const AppNoty: any;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor(public translate: TranslateService,
				private router: Router,
                private authenticationService: AuthenticationService,
                private store: Store<AppState>) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(err => {
			switch (err.status) {
				case 403:
					AppNoty.error([err?.error?.message ?? this.translate.instant('common.notify.error.messageAccessDeny')]);
					break;
				case 400:
					AppNoty.error([this.translate.instant('common.notify.error.message')]);
					break;
				case 401:
					// auto logout if 401 response returned from api
					this.authenticationService.logout();
					location.reload();
					break;
				case 422:
					// this.errorDialogService.openDialog(err.error.errors[0].msg);
					break;
				case 503:
					break;
				default:
					let data = {};
					data = {
						reason: err && err.error.message ? err.error.message : (err && err.message ? err.message : ''),
						status: err.status
					};
					// location.href = '/error/400.html';
					break;
			}
            this.store.dispatch(setLoadingSpinner({ status: false }));
			const error = err.error.message || err.statusText;
			return throwError(error);
		}));
	}
}
