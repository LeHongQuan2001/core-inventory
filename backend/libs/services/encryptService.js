const configs = require('../../configs/configs');
const forge = require('node-forge');

const keys = configs.web.rsa;

const encryptService = {
    isActive: keys.isActive || false,
    decryptRequest: (e) => {
        try {
            const {k: n, d: t} = e;
            const i = forge.pki.privateKeyFromPem(keys.privateKey);
            const r = forge.util.decodeUtf8(i.decrypt(forge.util.decode64(n)));
            const s = Buffer.from(t, "base64");
            const o = s.slice(0, 16);
            const u = s.slice(16);
            const c = forge.cipher.createDecipher("AES-CTR", Buffer.from(r, "base64").toString("binary"));
            return c.start({iv: o.toString("binary")}), c.update(forge.util.createBuffer(u)), c.finish(), forge.util.decodeUtf8(c.output.data);
        } catch (e) {
            return false;
        }
    },
    encryptResponse: (clientPublicKey, e) => {
        if (!encryptService.isActive) {
            return e;
        }
        try {
            const n = forge.random.getBytesSync(32);
            const t = forge.random.getBytesSync(16);
            const i = forge.cipher.createCipher("AES-CTR", n);
            i.start({
                iv: t
            }), i.update(forge.util.createBuffer(forge.util.encodeUtf8(JSON.stringify(e)))), i.finish();
            const r = Buffer.concat([Buffer.from(t, "binary"), Buffer.from(i.output.data, "binary")]);
            const publicKey = '-----BEGIN PUBLIC KEY-----' + clientPublicKey + '-----END PUBLIC KEY-----';
            const s = forge.pki.publicKeyFromPem(publicKey).encrypt(forge.util.encode64(n));
            return {
                d: r.toString("base64"),
                k: forge.util.encode64(s)
            };
        } catch (n) {
            return false;
        }
    }
}

module.exports = encryptService;
