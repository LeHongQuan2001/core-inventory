import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SiteLoaderService} from "../services/site-loader.service";

@Injectable()
export class SiteLoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

    constructor(private loaderService: SiteLoaderService) { }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        let siteLoading = this.requests.length > 0;
        if (i >= 0) {
            this.requests.splice(i, 1);
        }

        for (let i in this.requests) {
            if (this.requests[i] && typeof this.requests[i].body !== 'undefined' && this.requests[i].body && typeof this.requests[i].body.siteLoading !== 'undefined') {
                siteLoading = this.requests[i].body.siteLoading;
                delete this.requests[i].body.siteLoading;
                break;
            }
        }
        this.loaderService.isLoading.next(siteLoading);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requests.push(req);
        let siteLoading = true;
        // @ts-ignore
        if (req.body && typeof req.body.siteLoading !== 'undefined') {
            siteLoading = req.body.siteLoading
            delete req.body.siteLoading;
        // @ts-ignore
        } else {
            let value = req.params.get('siteLoading');
            siteLoading = value === 'false' ? false : siteLoading;
        }


        this.loaderService.isLoading.next(siteLoading);
        return Observable.create((observer: any) => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.removeRequest(req);
                            observer.next(event);
                        }
                    },
                    err => {
                        if (err.status === 401) {
                            // auto logout if 401 response returned from api
                            // this.authenticationService.logout();
                        }
                        // alert('error returned');
                        this.removeRequest(req);
                        observer.error(err);
                    },
                    () => {
                        this.removeRequest(req);
                        observer.complete();
                    });
            // remove request from queue when cancelled
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        });
    }
}
