import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {RoleModel} from "../models/role.model";
import {BackendService} from "../../../services/backend.service";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    protected apiServerPaths = environment.backendServer.paths;

    constructor(private http: HttpClient, private backendService: BackendService,) {
    }

    private _getModel(item: any) {
        const role = new RoleModel();
        role.id = item.id;
        role.name = item.name;
        role.status = item.status;
        role.permissionLocked = item.permissionLocked;
        return role;
    }

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
        return this.backendService.get(this.apiServerPaths.administrator.role.list, options, map(response => {
                const roles = [];
                // @ts-ignore
                const data = response.data.roles.data;
                // tslint:disable-next-line:forin
                for (const i in data) {
                    roles.push(new RoleModel(data[i]));
                }
                return {
                    data: roles,
                    // @ts-ignore
                    count: response.data.roles.count
                };
            })
        );
    }

    checkNameExist(name: any) {
        const options = {
            params: <any>{
                name: encodeURIComponent(name),
                encryptParam: true
            },
            headers: {
                Accept: 'application/json'
            }
        };
        return this.backendService.get(this.apiServerPaths.administrator.role.checkNameExist, options, map(response => {
            return {
                // @ts-ignore
                count: response.data.count
            };
        }));
    }

    create(role: RoleModel) {
        const options = {
            name: role.name,
            status: role.status,
            permissionLocked: role.permissionLocked,
            encryptBody: true
        };
        return this.backendService.post(this.apiServerPaths.administrator.role.create, options, map(response => {
                // @ts-ignore
                const role = new RoleModel();
                // @ts-ignore
                role.id = response.data.role.id;
                // @ts-ignore
                role.name = response.data.role.name;
                // @ts-ignore
                role.status = response.data.role.status;
                // @ts-ignore
                // tslint:disable-next-line:radix
                role.permissionLocked = parseInt(response.data.role.permissionLocked || 0);
                return role;
            })
        );
    }

    update(role: RoleModel) {
        const options = {
            id: role.id,
            name: role.name,
            status: role.status,
            encryptBody: true
        };
        let path = this.apiServerPaths.administrator.role.update;
        path = path.replace('{ROLE_ID}', role.id.toString());
        return this.backendService.put(path, options, map(response => {
                return response;
            })
        );
    }

    delete(role: RoleModel) {
        let path = this.apiServerPaths.administrator.role.delete;
        path = path.replace('{ROLE_ID}', role.id.toString());
        const options = {
            encryptBody: true
        }
        return this.backendService.delete(path, options, map(response => {
                return response;
            })
        );
    }
}
