module.exports = {
    slug: (text, separator) => {
        text = text.toString().toLowerCase().trim();
        const sets = [
            {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]'},
            {to: 'c', from: '[ÇĆĈČ]'},
            {to: 'd', from: '[ÐĎĐÞ]'},
            {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
            {to: 'g', from: '[ĜĞĢǴ]'},
            {to: 'h', from: '[ĤḦ]'},
            {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
            {to: 'j', from: '[Ĵ]'},
            {to: 'ij', from: '[Ĳ]'},
            {to: 'k', from: '[Ķ]'},
            {to: 'l', from: '[ĹĻĽŁ]'},
            {to: 'm', from: '[Ḿ]'},
            {to: 'n', from: '[ÑŃŅŇ]'},
            {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
            {to: 'oe', from: '[Œ]'},
            {to: 'p', from: '[ṕ]'},
            {to: 'r', from: '[ŔŖŘ]'},
            {to: 's', from: '[ßŚŜŞŠȘ]'},
            {to: 't', from: '[ŢŤ]'},
            {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
            {to: 'w', from: '[ẂŴẀẄ]'},
            {to: 'x', from: '[ẍ]'},
            {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
            {to: 'z', from: '[ŹŻŽ]'},
            {to: '-', from: '[·/_,:;\']'}
        ];

        sets.forEach(set => {
            text = text.replace(new RegExp(set.from,'gi'), set.to)
        });

        return text
            .replace(/\s+/g, separator)    // Replace spaces with -
            .replace(/[^-a-zа-я\u0370-\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
            .replace(/--+/g, separator)    // Replace multiple - with single -
            .replace(/^-+/, '')      // Trim - from start of text
            .replace(/-+$/, '')      // Trim - from end of text
    },
    random: (length) => {
        return Array(length).fill().map(() => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.random() * 62)).join("")
    },
    sprintf: (args) => {
        let string = args[0],
            i = 1
        return string.replace(/%((%)|s|d)/g, function (m) {
            // m is the matched format, e.g. %s, %d
            let val = null
            if (m[2]) {
                val = m[2]
            } else {
                val = args[i]
                // A switch statement so that the formatter can be extended. Default is %s
                if (m === '%d') {
                    val = parseFloat(val);
                    if (isNaN(val)) {
                        val = 0
                    }
                }
                i++
            }
            return val
        })
    },
    getRandomNumber: (length) => {
        const base = "0123456789"
        let result = ""
        const baseLength = base.length
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * (baseLength - 0)) + 0
            result += base[randomIndex]
        }
        return result
    },
    ip2int: (ip) => {
        return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
    },
    int2ip: (ipInt) => {
        return ( (ipInt>>>24) +'.' + (ipInt>>16 & 255) +'.' + (ipInt>>8 & 255) +'.' + (ipInt & 255) );
    },
    uuid: {
        fromBinary: (buf) => {
            return [
                buf.toString("hex", 4, 8),
                buf.toString("hex", 2, 4),
                buf.toString("hex", 0, 2),
                buf.toString("hex", 8, 10),
                buf.toString("hex", 10, 16),
            ].join("-");
        },
        toBinary: (uuid) => {
            const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
            return Buffer.concat([
                buf.slice(6, 8),
                buf.slice(4, 6),
                buf.slice(0, 4),
                buf.slice(8, 16),
            ]);
        }
    },
    toBinary: (s) => {
        const buf = Buffer.from(s.toString(), 'utf8');
        return buf;
    },
    clearNullValue: (object) => {
        return Object.fromEntries(
            Object.entries(object).filter(([key, value]) => value !== null)
        );
    }
}
