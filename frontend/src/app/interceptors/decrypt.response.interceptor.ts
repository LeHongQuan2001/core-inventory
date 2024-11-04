import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import {filter, map, Observable, tap } from 'rxjs';
import { EncryptService } from '../services/encrypt.service';

@Injectable()
export class DecryptResponseInterceptor implements HttpInterceptor {
    constructor(private encryptService: EncryptService) {
    }

    // @ts-ignore
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            // @ts-ignore
            filter(event => event instanceof HttpResponse),
            map((event: HttpResponse<any>) => {
                let result = false;
                if (event instanceof HttpResponse) {
                    const body = event.body;
                    const decrypt = typeof body.decrypt !== 'undefined' && body.decrypt === false ? false : true;
                    const data = body.data || false;
                    if (data && typeof data.d !== 'undefined' && typeof data.k !== 'undefined') {
                        const bodyDecrypt = decrypt ? this.encryptService.decryptResponse(data) : data;
                        result = bodyDecrypt ? (decrypt ? JSON.parse(bodyDecrypt) : data) : false;
                        body.data = result;
                        return event.clone({ body });
                    }
                }
                return event;
            }, (error: any) => event)
        );
    }
}
