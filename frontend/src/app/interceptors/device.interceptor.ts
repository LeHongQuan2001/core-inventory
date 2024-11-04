import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppCookieService} from "../services/app-cookie.service";

@Injectable()
export class DeviceInterceptor implements HttpInterceptor {
    constructor(private appCookieService: AppCookieService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const deviceId = this.appCookieService.getDeviceId();
        if (deviceId) {
            request = request.clone({
                setHeaders: {
                    'Device-Id': deviceId
                }
            });
        }

        // @ts-ignore
        return next.handle(request);
    }
}
