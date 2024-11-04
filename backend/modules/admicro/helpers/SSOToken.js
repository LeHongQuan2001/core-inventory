var crypto = require("crypto");
var base64 = require('base-64');
var utf8 = require('utf8');
module.exports = {
    string_shuffle: function (str) {
        var a = str.split(""),
            n = a.length;

        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    },
    randiv: function (length, add_dashes, available_sets) {
        var length = typeof length !== 'undefined' ? length : 16;
        var add_dashes = typeof add_dashes !== 'undefined' ? add_dashes : false;
        var available_sets = typeof available_sets !== 'undefined' ? available_sets : 'luds';

        var sets = [];
        if (available_sets.indexOf('l') !== -1)
            sets[0] = 'abcdefghjkmnpqrstuvwxyz';
        if (available_sets.indexOf('u') !== -1)
            sets[1] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
        if (available_sets.indexOf('d') !== -1)
            sets[2] = '23456789';
        if (available_sets.indexOf('s') !== -1)
            sets[3] = '!@#$%&*?';
        var all = '';
        var iv = '';

        var num_sets = sets.length;
        for (var i = 0; i < num_sets; i++) {
            var n = sets[i].length;
            var rnd = Math.floor(Math.random() * n);
            iv += sets[i].charAt(rnd);
            all += sets[i];
        }
        var num_all = all.length;
        for (i = 0; i < length - num_sets; i++) {
            var rnd = Math.floor(Math.random() * num_all);
            iv += all.charAt(rnd);
        }
        iv = module.exports.string_shuffle(iv);
        if (!add_dashes) {
            return iv;
        }
        var dash_len = Math.floor(Math.sqrt(length));
        var dash_str = '';
        while (iv.length > dash_len) {
            dash_str += iv.substr(0, dash_len) + '-';
            iv = iv.substr(dash_len);
        }
        dash_str += iv;
        return dash_str;
    },
    hash_hmac: function (algo, key, str) {
        return crypto.createHmac(algo, key).update(str).digest("hex");
    },
    base64_encode: function (str) {
        var bytes = utf8.encode(str);
        var encoded = base64.encode(bytes);
        encoded = encoded.replace(/\+/gi, "-");
        encoded = encoded.replace(/\//gi, "_");
        return encoded;
    },
    base64_decode: function (str_encoded) {
        str_encoded = str_encoded.replace(/-/gi, "+");
        str_encoded = str_encoded.replace(/_/gi, "/");
        var bytes = base64.decode(str_encoded);
        return utf8.decode(bytes);
    },
    openssl_encrypt: function (str_encrypt, algo, key, iv) {
        var cipher = crypto.createCipheriv(algo, key, iv);
        var encrypted = cipher.update(str_encrypt, 'utf8', 'base64') + cipher.final('base64');
        return encrypted;
    },
    // return base64 string
    openssl_decrypt: function (str_encrypted, algo, key, iv) {
        var decipher = crypto.createDecipheriv(algo, key, iv);
        var rel = decipher.update(str_encrypted, 'base64', 'utf8');
        rel += decipher.final('utf8');

        return rel;
    },

    create: function (domain, private_key) {
        var cDate = new Date();
        var y = cDate.getFullYear();
        var m = parseInt(cDate.getMonth(), 10);
        m = m + 1;
        m = m < 10 ? '0' + m : m;

        var d = parseInt(cDate.getDate(), 10);
        d = d < 10 ? '0' + d : d;

        var h = parseInt(cDate.getHours(), 10);
        h = h < 10 ? '0' + h : h;

        var i = parseInt(cDate.getMinutes(), 10);
        i = i < 10 ? '0' + i : i;

        var s = parseInt(cDate.getSeconds(), 10);
        s = s < 10 ? '0' + s : s;

        var str_encrypt = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
        str_encrypt += domain;

        var iv = module.exports.randiv();
        var encrypt_key = module.exports.hash_hmac('sha256', iv, private_key);
        encrypt_key = encrypt_key.substr(0, 32);
        var iv_for_iv = crypto.createHash('md5').update(private_key, 'utf-8').digest('hex').substr(0, 16);

        var token = module.exports.openssl_encrypt(str_encrypt, 'AES-256-CBC', encrypt_key, iv);
        token = token.replace(/\+/gi, "-");
        token = token.replace(/\//gi, "_");


        var iv_encoded = module.exports.openssl_encrypt(iv, 'AES-256-CBC', private_key.substr(0, 32), iv_for_iv);
        iv_encoded = iv_encoded.replace(/\+/gi, "-");
        iv_encoded = iv_encoded.replace(/\//gi, "_");
        return token + iv_encoded;
    },
    validate: function (token, domain, private_key, expire_time) {
        var expire_time = typeof expire_time !== 'undefined' ? expire_time : 180;

        token = token.trim();
        var token_len = token.length;
        if (token_len <= 44) {
            return false;
        }

        var iv_encrypt = token.substr(-44);
        iv_encrypt = iv_encrypt.replace(/-/gi, "+");
        iv_encrypt = iv_encrypt.replace(/_/gi, "/");

        token = token.substr(0, token_len - 44);
        token = token.replace(/-/gi, "+");
        token = token.replace(/_/gi, "/");

        var iv_for_iv = crypto.createHash('md5').update(private_key, 'utf-8').digest('hex').substr(0, 16);
        var iv = module.exports.openssl_decrypt(iv_encrypt, 'AES-256-CBC', private_key.substr(0, 32), iv_for_iv);

        var encrypt_key = module.exports.hash_hmac('sha256', iv, private_key);
        encrypt_key = encrypt_key.substr(0, 32);
        var str_decrypted = module.exports.openssl_decrypt(token, 'AES-256-CBC', encrypt_key, iv);

        var domain_strlen = domain.length;
        domain_strlen = 0 - domain_strlen;
        // check time
        var time_check = str_decrypted.substr(0, str_decrypted.length + domain_strlen);
        var dtime = new Date(time_check);
        if (isNaN(dtime.getMonth())) {
            return false;
        }
        var currTime = (new Date()).getTime() / 1000;
        // expire time: default 3 minute
        if (currTime - (dtime.getTime() / 1000) > expire_time) {
            return false;
        }

        // check domain
        var domain_valid = str_decrypted.substr(domain_strlen);
        if (domain != domain_valid) {
            return false;
        }

        return true;
    },
    login_info: function (login_token, domain, private_key, expire_time) {
        var expire_time = typeof expire_time !== 'undefined' ? expire_time : 180;

        var userInfo = {uid: 0, uname: ""};

        login_token = login_token.trim();
        var token_len = login_token.length;
        if (token_len <= 44) {
            return userInfo;
        }

        var iv_encrypt = login_token.substr(-44);
        iv_encrypt = iv_encrypt.replace(/-/gi, "+");
        iv_encrypt = iv_encrypt.replace(/_/gi, "/");

        login_token = login_token.substr(0, token_len - 44);
        login_token = login_token.replace(/-/gi, "+");
        login_token = login_token.replace(/_/gi, "/");

        var iv_for_iv = crypto.createHash('md5').update(private_key, 'utf-8').digest('hex').substr(0, 16);
        var iv = module.exports.openssl_decrypt(iv_encrypt, 'AES-256-CBC', private_key.substr(0, 32), iv_for_iv);

        var encrypt_key = module.exports.hash_hmac('sha256', iv, private_key);
        encrypt_key = encrypt_key.substr(0, 32);
        var str_decrypted = module.exports.openssl_decrypt(login_token, 'AES-256-CBC', encrypt_key, iv);

        var domain_strlen = domain.length;

        // check time
        var time_check = str_decrypted.substr(0, 19);
        var dtime = new Date(time_check);
        if (isNaN(dtime.getMonth())) {
            return userInfo;
        }
        var currTime = (new Date()).getTime() / 1000;
        // expire time: default 3 minute
        if (currTime - (dtime.getTime() / 1000) > expire_time) {
            return userInfo;
        }

        // check domain
        var domain_valid = str_decrypted.substr(19, domain_strlen);
        if (domain != domain_valid) {
            return userInfo;
        }

        // check user data
        var user_data = str_decrypted.substr(19 + domain_strlen);

        try {
            var objUser = JSON.parse(user_data);
            if (objUser.hasOwnProperty("uid") && objUser.hasOwnProperty("uname")) {
                var uid = parseInt(objUser.uid, 10);
                if (uid > 0) {
                    userInfo.uid = uid;
                    userInfo.uname = objUser.uname.trim();
                }
            }
        } catch (e) {

        }
        return userInfo;
    }
}
