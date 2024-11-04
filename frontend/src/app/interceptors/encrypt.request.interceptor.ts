import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpParams } from '@angular/common/http';
import {filter, map, Observable, tap } from 'rxjs';
import { EncryptService } from '../services/encrypt.service';
import {environment} from "../../environments/environment";

@Injectable()
export class EncryptRequestInterceptor implements HttpInterceptor {
    constructor(private encryptService: EncryptService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!environment.rsa.isActive) {
            if (typeof request.body !== 'undefined' && request.body && typeof request.body.encryptBody !== 'undefined') {
                delete request.body.encryptBody;
            }
            if (request.params.get('encryptParam') === 'true') {
                const httpParams = request.params;
                const keys = httpParams.keys();
                const object = {};
                for (const i in keys) {
                    switch (keys[i]) {
                        case 'requestTime':
                        case 'encryptParam':
                            break;
                        default:
                            // @ts-ignore
                            object[keys[i]] = httpParams.get(keys[i]);
                    }
                }
                const params = new HttpParams({
                    fromObject: object
                });
                request = request.clone({
                    params: params
                });
            }
            return next.handle(request);
        }

        const encryptBody = typeof request.body !== 'undefined' && request.body ? request.body.encryptBody || false : false;
        const encryptParam = request.params.get('encryptParam') === 'true' ? true : false;

        if (request && request.body) {
            delete request.body.encryptBody;
            let siteLoading = true;
            if (request && request.body && typeof request.body.siteLoading !== 'undefined') {
                siteLoading = request.body.siteLoading;
                delete request.body.siteLoading;
            }
            if (encryptBody) {
                const t = Object.assign({}, this.encryptService.encryptRequest(request.body));
                request = request.clone({
                    body: t
                });
            }
            request.body.siteLoading = siteLoading;
        } else if (encryptParam) {
            const params = {}
            const keys = request.params.keys().filter(e => e !== 'encryptParam')
            for (const i in keys) {
                // @ts-ignore
                params[keys[i]] = request.params.get(keys[i])
            }
            const t = Object.assign({}, this.encryptService.encryptRequest(params));
            const httpParams = new HttpParams({
                fromObject: t
            });

            request = request.clone({
                params: httpParams
            });
        }
        return next.handle(request);
    }
}
