import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {BackendService} from "../../../services/backend.service";
import { ActionLogModel } from '../models/action-log.model';

@Injectable({
    providedIn: 'root'
})
export class ActionLogService {

    protected apiServerPaths = environment.backendServer.paths;

    constructor(public backendService: BackendService) {
    }

    search(queries: any) {
        const options: any = {
            params: <any>{
                encryptParam: true
            },
            headers: {
                Accept: 'application/json'
            }
        };
        // tslint:disable-next-line:forin
        for (const i in queries) {
            options.params[i] = queries[i];
        }
        const path = this.apiServerPaths.administrator.actionLog.list;
        return this.backendService.get(path, options, map((response: any) => {
                const logList: ActionLogModel[] = [];
                response?.data?.logs?.data.forEach((item: any) => {
                    logList.push(new ActionLogModel(item));
                });
                return {
                    status: response?.status,
                    message: response?.message,
                    data: {
                        logList,
                        count: response?.data?.logs?.count ?? 0
                    },
                    code: response?.code
                };
            })
        );
    }  
}
