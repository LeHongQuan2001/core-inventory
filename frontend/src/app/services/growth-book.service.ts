import { Injectable } from '@angular/core';
import { GrowthBook } from "@growthbook/growthbook";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class GrowthBookService {

    enabled = false;
    growthBook: any;

    constructor() {
        this.enabled = environment.growthBook.enabled;
        if (this.enabled) {
            if (environment.growthBook.encrypt) {
                this.growthBook = new GrowthBook({
                    apiHost: environment.growthBook.apiHost,
                    clientKey: environment.growthBook.clientKey,
                    decryptionKey: environment.growthBook.decryptionKey,
                    enableDevMode: environment.growthBook.devMode,
                    trackingCallback: (experiment, result) => {
                        console.log("Viewed Experiment", {
                            experimentId: experiment.key,
                            variationId: result.key
                        });
                    }
                });
            } else {
                this.growthBook = new GrowthBook({
                    apiHost: environment.growthBook.apiHost,
                    clientKey: environment.growthBook.clientKey,
                    enableDevMode: environment.growthBook.devMode,
                    trackingCallback: (experiment, result) => {
                        console.log("Viewed Experiment", {
                            experimentId: experiment.key,
                            variationId: result.key
                        });
                    }
                });
            }
        }
    }

    public async loadFeatures() {
        if (this.enabled) {
            await this.growthBook.loadFeatures({autoRefresh: true});
        }
    }

    public setAttribute(user: any) {
        if (!this.enabled || !user) return this;
        this.growthBook.setAttributes({
            "id": user.userId.toString(),
            "email": user.email.toString(),
            "roleId": parseInt(user.roleId)
        });
        return this;
    }

    public isOn(feature: string) {
        return !this.enabled ? true : this.growthBook.isOn(feature);
    }
}
