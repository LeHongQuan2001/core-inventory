import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {BackendService} from "../../../services/backend.service";
import {UserModel} from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AdministratorUserService {
    protected apiServerPaths = environment.backendServer.paths;

    constructor(private http: HttpClient, private backendService: BackendService) {
    }

    private _getModel(item: any) {
        const user = new UserModel();
        user.id = item.id;
        user.username = item.username;
        user.email = item.email;
        user.avatar = item.avatar;
        user.fullName = item.fullName;
        user.roleId = item.roleId;
        user.status = item.status;
        user.roleName = item.role ? item.role.name : null;
        user.allow = item.allow;
        user.createdAt = item.createdAt;
        return user;
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
        return this.backendService.get(this.apiServerPaths.administrator.user.list, options, map((response: any) => {
                const users: UserModel[] = [];
                const data = response.data.users;
                // tslint:disable-next-line:forin
                for (const i in data) {
                    users.push(this._getModel(data[i]));
                }
                return {
                    data: users,
                    count: response.data?.count
                };
            })
        );
    }

    search(queries: any = {}) {
        const options = {
            params: <any>{
                encryptParam: true
            },
            headers: {
                Accept: 'application/json'
            }
        };
        for (const i in queries) {
            options.params[i] = queries[i];
        }
        return this.backendService.get(this.apiServerPaths.administrator.user.list, options, map((response: any) => {
                const users: UserModel[] = [];
                const data = response.data.users;
                for (const i in data) {
                    users.push(this._getModel(data[i]));
                }
                return {
                    data: users,
                    count: response.data?.count
                };
            })
        );
    }

    create(user: any, encryptBody = false) {
        const options = {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            role_id: user.roleId,
            status: user.status,
            password: user.password,
            confirmPassword: user.confirmPassword,
            apps: user.domains,
            phone: user.phone,
            encryptBody
        };
        return this.backendService.post(this.apiServerPaths.administrator.user.create, options, map(response => {
                return response
            })
        );
    }

    update(user: UserModel, currentPassword = '', newPassword = '', confirmPassword = '', encryptBody = false) {
        const options: any = {
            roleId: user.roleId,
            status: user.status,
            encryptBody
        };
        if (newPassword) {
            options.password = newPassword;
            options.confirmPassword = confirmPassword;
            options.currentPassword = currentPassword;
        }
        let url = this.apiServerPaths.administrator.user.update;
        url = url.replace('{USER_ID}', String(user.id));

        return this.backendService.put(url, options, map(response => {
                return response;
            })
        );
    }

    changePassword(user: UserModel, currentPassword = '', newPassword = '', confirmPassword = '', encryptBody = false) {
        const options: any = {
            roleId: user.roleId,
            status: user.status,
            encryptBody
        };
        if (newPassword) {
            options.password = newPassword;
            options.confirmPassword = confirmPassword;
            options.currentPassword = currentPassword;
        }

        let url = this.apiServerPaths.administrator.user.changePassword;
        url = url.replace('{USER_ID}', String(user.id));

        return this.backendService.put(url, options, map(response => {
                return response;
            })
        );
    }

    setRole(userId: number, roleId: number) {
        let url = this.apiServerPaths.administrator.user.setRole;
        url = url.replace('{USER_ID}', String(userId));
        const options = {
            roleId: roleId,
            encryptBody: true
        }
        return this.backendService.put(url, options, map(response => {
                return response;
            })
        );
    }

    editAvatar(data: any) {
        const options = data;
        const path = this.apiServerPaths.administrator.user.editAvatar;
        return this.backendService.put(path, options, map((response: any) => {
                return response;
            })
        );
    }
}
