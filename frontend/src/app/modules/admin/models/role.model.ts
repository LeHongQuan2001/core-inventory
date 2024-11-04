export class RoleModel {
    id: number = 0;
    name = '';
    status: number = 0;
    permissionLocked = 0;

    constructor(data?: any) {
        if (data) {
            this.id = data.id || null;
            this.name = data.name || null;
            this.status = data.status || 0;
            this.permissionLocked = data.permissionLocked || 0;
        }
    }
}
