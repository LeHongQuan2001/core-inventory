import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {RouteModel} from "../models/route.model";
import {BackendService} from "../../../services/backend.service";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
    protected apiServerPaths = environment.backendServer.paths;

    constructor(private http: HttpClient, private backendService: BackendService) {}

    get(queries: {}) {
        const options = {
            params: <any>{
                encryptParam: true
            },
            headers: {
                Accept: 'application/json'
            }
        };
        // tslint:disable-next-line:forin
        for (const i in queries) {
            // @ts-ignore
            options.params[i] = queries[i];
        }
        return this.backendService.get(this.apiServerPaths.administrator.route.list, options, map((response: any) => {
                const routes = [];
                // @ts-ignore
                const data = response.data.routes;
                if (data && data.length) {
                    // tslint:disable-next-line:forin
                    for (const i in data) {
                        routes.push(new RouteModel(data[i]));
                    }
                }
                return {
                    data: routes,
                    count: response.data.count
                };
            })
        );
    }

    import() {
        const options = {
            params: <any>{
                encryptParam: true
            },
            headers: {
                Accept: 'application/json'
            }
        };
        return this.backendService.get(this.apiServerPaths.administrator.route.import, options, map(response => {
            return response;
        }));
    }

    update(id: number, data: any) {
        const options = data;
        options.encryptBody = true;
        const url = this.apiServerPaths.administrator.route.update.replace('{ROUTE_ID}', id.toString())
        return this.backendService.post(url, options, map(response => {
                return response;
            })
        );
    }

    updateRoute(routeData: any) {
        const options = {
            id: routeData.id,
            route: routeData.route
        };
        return this.backendService.post(this.apiServerPaths.administrator.route.update, options, map(response => {
                return response;
            })
        );
    }
}
