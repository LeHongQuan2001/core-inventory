export class AclModel {
    id: string = '';
    name: string = '';
    uri: string = '';
    vendor: string = '';
    package: string = '';
    controller: string = '';
    methods = [];
    middleware = [];
    wheres = [];
    isAllow = false ;

    constructor(data?: any) {
        if (data) {
            this.id = data.route.id || null;
            this.name = data.route.name || null;
            this.uri = data.route.uri || null;
            this.vendor = data.route.vendor || null;
            this.package = data.route.package || null;
            this.methods = data.route.methods || [];
            this.controller = data.route.controller || null;
            this.middleware = data.route.middleware || [];
            this.wheres = data.route.wheres || null;
            this.isAllow = data.allow === 1;
        }
    }
}
