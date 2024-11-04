import {Injectable} from "@angular/core";
import * as forge from 'node-forge';
import * as buffer from 'buffer';
import {environment} from "../../environments/environment";
(window as any).Buffer = buffer.Buffer;

@Injectable({providedIn: 'root'})
export class EncryptService {
    isActive = environment.rsa.isActive || false;
    keys: any;
    clientPublicKey: any;
    clientPrivateKey: any;

    defaults = {
        publicKey: environment.rsa.server.publicKeyEncode
    };

    constructor() {}

    get defaultPublicKey() {
        const { publicKey: e } = this.defaults;
        return e;
    }
    
    genKeys(keys: any) {
        if (!this.isActive || this.keys) { return; }
        if (keys !== null && typeof keys.k !== 'undefined' && typeof keys.p !== 'undefined') {
            this.clientPublicKey = keys.p;
            this.clientPrivateKey = keys.k;
        } else {
            this.keys = forge.pki.rsa.generateKeyPair({
                bits: 1024,
                workers: 1
            }),
                this.clientPublicKey = forge.pki.publicKeyToPem(this.keys.publicKey).replace(/(-|(BEGIN|END) PUBLIC KEY|\r|\n)/gi, ""),
                this.clientPrivateKey = forge.pki.privateKeyToPem(this.keys.privateKey);
        }
    }
    
    encryptRequest(e: any) {
        if (!this.isActive) {
            return e;
        }
        try {
            const n = forge.random.getBytesSync(32);
            const t = forge.random.getBytesSync(16);
            e = Object.assign({
                clientPubKey: this.clientPublicKey,
                timestamp: (new Date).getTime()
            }, e);
            const i = forge.cipher.createCipher("AES-CTR", n);
            i.start({
                iv: t
            }),
            i.update(forge.util.createBuffer(forge.util.encodeUtf8(JSON.stringify(e)))),
            i.finish();
            const r = Buffer.concat([Buffer.from(t, "binary"), Buffer.from(i.output.data, "binary")]);
            const s = forge.pki.publicKeyFromPem(forge.util.decode64(this.defaultPublicKey)).encrypt(forge.util.encode64(n));
            return {
                d: r.toString("base64"),
                k: forge.util.encode64(s)
            };
        } catch (n) {
            console.log(n);
        }
    }
    decryptResponse(e: any) {
        const { k: n, d: t } = e;
        const i = forge.pki.privateKeyFromPem(this.clientPrivateKey);
        const r = forge.util.decodeUtf8(i.decrypt(forge.util.decode64(n)));
        const s = Buffer.from(t, "base64");
        const o = s.slice(0, 16);
        const u = s.slice(16);
        const c = forge.cipher.createDecipher("AES-CTR", Buffer.from(r, "base64").toString("binary"));
        return c.start({
            iv: o.toString("binary")
        }), c.update(forge.util.createBuffer(u)), c.finish(), forge.util.decodeUtf8(c.output.data);
    }
}
