import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import {Observable, tap } from 'rxjs';
import {environment} from "../../environments/environment";
import {ReCaptchaV3Service} from "ng-recaptcha";

@Injectable()
export class GoogleRecaptchaInterceptor implements HttpInterceptor {
    constructor(private reCaptchaV3Service: ReCaptchaV3Service) {
    }

    // @ts-ignore
    async intercept(request: HttpRequest<any>, next: HttpHandler): Promise<Observable<HttpEvent<any>>> {
        if (environment.google.clientVerify) {
            const method = request.method.toLowerCase();
            switch (method) {
                case 'post':
                case 'put':
                case 'delete':
                case 'patch':
                    const needVerifyClient = typeof request.body !== 'undefined' && request.body
                                                                            ? request.body.verifyClient || false : false;
                    if (needVerifyClient) {
                        delete request.body.verifyClient;
                        const googleToken = await this.reCaptchaV3Service.execute('importantAction').pipe(
                            tap((res: string) => {
                                return res;
                            })
                        ).toPromise();
                        const t = Object.assign(request.body, {
                            captcha: googleToken
                        });
                        request = request.clone({
                            body: t
                        });
                    }
                    break;
                case 'get':
                default:
                    break;
            }
        }

        // @ts-ignore
        return next.handle(request).toPromise();
    }
}
