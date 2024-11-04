export class RouteModel {
    id: string = '';
    name: string = '';
    route: string = '';
    uri: string = '';
    vendor: string = '';
    package: string = '';
    controller: string = '';
    methods: [] = [];
    middleware: [] = [];
    wheres: [] = [];

    constructor(data?: any) {
        if (data) {
            this.id = data.id || null;
            this.name = data.name || null;
            this.route = data.route || null;
            this.uri = data.uri || null;
            this.vendor = data.vendor || null;
            this.package = data.package || null;
            this.methods = data.methods || [];
            this.controller = data.controller || null;
            this.middleware = data.middleware || [];
            this.wheres = data.wheres || null;
        }
    }

}
