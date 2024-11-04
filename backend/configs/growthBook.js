require('dotenv').load()
module.exports = {
    enabled: process.env.GROWTH_BOOK_ENABLE === 'true',
    debug: true,
    apiHost: process.env.GROWTH_BOOK_API_HOST || null,
    clientKey: process.env.GROWTH_BOOK_API_CLIENT_KEY || null,
    decryptionKey: process.env.GROWTH_BOOK_API_DECRYPTION_KEY || null,
    features: {}
}
