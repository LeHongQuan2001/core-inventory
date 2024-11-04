import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {BackendResponseModel} from '../models/backend.response.model';

@Injectable({
    providedIn: 'root'
})
export class BackendService {

    protected apiServer = environment.backendServer;

    constructor(private httpClient: HttpClient) {
    }

    _buildUrl(path: string) {
        let baseUrl = '';
        if (this.apiServer.host) {
            baseUrl = this.apiServer.port === 443 ? 'https://' : 'http://';
            baseUrl += this.apiServer.host;
            if (this.apiServer.port !== 80 && this.apiServer.port !== 443) {
                baseUrl += `:${this.apiServer.port}`;
            }
        }
        if (this.apiServer.prefix !== '') {
            baseUrl += '/' + this.apiServer.prefix;
        }
        return baseUrl + '/' + path;
    }

    get(path: string, options: {}, callback: any = null): Observable<any> {
        return this.httpClient.get<BackendResponseModel>(this._buildUrl(path), options)
            .pipe(callback || '');
    }

    getFile(path: string, options: {}, callback: any = null): Observable<any> {
        return this.httpClient.get(this._buildUrl(path), options)
            .pipe(callback || '');
    }

    post(path: string, options: any, callback: any = null, pipeline = true): Observable<any> {
        let body = typeof options.body !== 'undefined' ? options.body : null;
        body = body == null && typeof options.params !== 'undefined' ? options.params : options;
        const headers = typeof options.headers !== 'undefined' ? options.headers : {};
    
        const request = this.httpClient.post<BackendResponseModel>(this._buildUrl(path), body, headers);
        return pipeline ? request.pipe(callback || null) : request;
    }

    delete(path: string, options: any, callback: any = null): Observable<any> {
        let body = typeof options.body !== 'undefined' ? options.body : null;
        body = body == null && typeof options.params !== 'undefined' ? options.params : options;
        // @ts-ignore
        return this.httpClient.delete<BackendResponseModel>(this._buildUrl(path), {body})
            .pipe(callback || '');
    }

    put(path: string, options: {}, callback: any = null): Observable<any> {
        return this.httpClient.put<BackendResponseModel>(this._buildUrl(path), options)
            .pipe(callback || '');
    }
}
