const NodeRSA = require('node-rsa')

module.exports = {
    encrypt: (plainText, key, format = 'private') => {
        const keyEncrypt = new NodeRSA(key, format, {
            encryptionScheme: 'pkcs1'
        })
        return keyEncrypt.encrypt(plainText, 'base64', 'utf8')
    },
    decrypt: (encryptText, key, format = 'private') => {
        const keyDecrypt = new NodeRSA(key, format, {
            encryptionScheme: 'pkcs1'
        });
        return keyDecrypt.decrypt(encryptText, 'utf8')
    }
}
