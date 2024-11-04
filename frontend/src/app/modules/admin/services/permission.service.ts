import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {AclModel} from "../models/acl.model";
import {BackendService} from "../../../services/backend.service";

@Injectable({
    providedIn: 'root'
})
export class AdministratorPermissionService {
    protected apiServerPaths = environment.backendServer.paths;

    constructor(private http: HttpClient, private backendService: BackendService) {}

    details(objectType: string, objectId: number) {
        const options = {
            headers: {
                Accept: 'application/json'
            },
            params: <any>{
                encryptParam: true
            },
        };
        const url = this.apiServerPaths.administrator.permission.details + `/${objectType}/${objectId}`;
        return this.backendService.get(url, options, map((response: any) => {
                const objectsAll = [];
                const objectsAllow = [];
                const objectsDeny = [];
                // @ts-ignore
                const data = response.data.routes;
                // tslint:disable-next-line:forin
                for (const i in data) {
                    const objectModel = new AclModel(data[i]);
                    objectsAll.push(objectModel);
                    if (objectModel.isAllow === true) {
                        objectsAllow.push(objectModel);
                    } else {
                        objectsDeny.push(objectModel);
                    }

                }

                const packages = [];
                // @ts-ignore
                for (const i in response.data.modules) {
                    // @ts-ignore
                    const module = response.data.modules[i];
                    // tslint:disable-next-line:forin
                    for (const j in module) {
                        packages.push(i + ' / ' + module[j]);
                    }
                }

                const featureFlags = response.data.featureFlags;

                return {
                    data: {
                        routes: {
                            all: objectsAll,
                            allow: objectsAllow,
                            deny: objectsDeny
                        },
                        // @ts-ignore
                        extraPermission: response.data.extra_permission,
                        // @ts-ignore
                        packages,
                        featureFlags
                    },
                    // @ts-ignore
                    count: objectsAll.length
                };
            })
        );
    }

    set(objectType: string, objectId: number, acl: AclModel, allow: boolean) {
        const options = {
            routeId: acl.id,
            allow,
            encryptBody: true
        };
        const url = this.apiServerPaths.administrator.permission.set + `/${objectType}/${objectId}`;
        return this.backendService.post(url, options, map(response => {
                // @ts-ignore
                return response;
            })
        );
    }

    setExtraPermissions(objectType: string, objectId: number, extraPermissions: JSON) {
        const options = {
            extra_permissions: extraPermissions
        };
        const url = this.apiServerPaths.administrator.permission.setExtra + `/${objectType}/${objectId}`;
        return this.backendService.post(url, options, map(response => {
                // @ts-ignore
                return response;
            })
        );
    }


}
