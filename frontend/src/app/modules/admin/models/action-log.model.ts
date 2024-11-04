import * as moment from "moment";

export class ActionLogModel {
    user: any;
    originalUser: any;
    device = '';
    ip = '';
    action = '';
    body: any;
    oldBody: any;
    module = '';
    createdAt: any;
    path = '';
    id: any = null;
    params: any;

    constructor(data?: any) {
        if (data) {
            this.user = data?.user ?? null;
            this.device = data?.device ? data.device.trim() : '';
            this.ip = data.ip ?? '';
            this.action = data.action ?? '';
            this.body = data?.dataRequest ? JSON.parse(data.dataRequest) : null;
            this.oldBody = data?.oldDataRequest ? JSON.parse(data.oldDataRequest) : null;
            this.module = data?.module ?? '';
            this.createdAt = data?.createdAt ? moment(data.createdAt).format('HH:mm:ss DD/MM/yyyy') : '';
            this.path = data?.path ?? '';
            this.params = data?.params ? JSON.parse(data.params) : null;
            this.originalUser = data?.originalUser ?? null
        }
    }
}