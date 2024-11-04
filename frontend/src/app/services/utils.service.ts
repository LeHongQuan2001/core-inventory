import {Injectable} from '@angular/core';
import {UUID} from "angular2-uuid";

const md5 = require('md5');

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    
    constructor() {
    }
    
    stringRandom(length = 1, prefix: any = null, postfix: any = null) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        let result = '';
        while (counter <= length) {
            result += characters.charAt(Math.floor((Math.random() * charactersLength)));
            counter++;
        }
        
        result = prefix ? `${prefix}-${result}` : result;
        result = postfix ? `${result}-${postfix}` : result;
        return result;
    }
    
    addCommas(str: string, commas = ',') {
        str += '';
        let num = str.replaceAll(commas, '');
        num = num.replace(/\D/g, '');
        return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + commas);
    }
    
    randomUUID() {
        return UUID.UUID();
    }
    
    md5(string: string) {
        return md5(string);
    }

    clearDomain(domain: string) {
        let cleanUrl = domain.replace(/^(http:\/\/|https:\/\/)/, '');
        cleanUrl = cleanUrl.replace(/^(www\.|app\.)/, '');
        if (cleanUrl.includes('/')) {
            cleanUrl = cleanUrl.split('/')[0];
        }
        return cleanUrl;
    }

    isValidURL(url: string) {
        try {
            const urlFormatted = new URL(url);
            const validProtocol = urlFormatted.protocol === "https:";
            const validPort = urlFormatted.port.length === 0;
            if (validPort && validProtocol) {
                return true
            }
    
            return false
        } catch (error) {
            return false
        }
    }
}
