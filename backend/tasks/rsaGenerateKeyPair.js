// node modules
const fs = require('fs');

// npm modules
const NodeRSA = require('node-rsa');

// generate keys
const key = new NodeRSA().generateKeyPair();
const publicKey = key.exportKey('pkcs8-public-pem');
const privateKey = key.exportKey('pkcs1-pem');

// write public key
fs.openSync('./storage/keys/public.pem', 'w');
fs.writeFileSync('./storage/keys/public.pem', publicKey, 'utf8');

// write private key
fs.openSync('./storage/keys/private.pem', 'w');
fs.writeFileSync('./storage/keys/private.pem', privateKey, 'utf8');

console.log(`Private Key:`)
console.log(privateKey)
console.log(`-----------------------------------------------------`)
console.log(`Public Key:`)
console.log(publicKey)
