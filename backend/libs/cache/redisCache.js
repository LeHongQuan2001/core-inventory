const configs = require('../../configs/configs')
const redis = require('redis')
const { promisifyAll } = require('bluebird');
const cacheConfigs = configs.redis.cache

// create and connect redis client to local instance.
const redisClient = redis.createClient({
    host: cacheConfigs.host,
    port: cacheConfigs.port,
    password: cacheConfigs.auth
})
redisClient.select(cacheConfigs.db)
promisifyAll(redisClient);

// echo redis errors to the console
redisClient.on('error', (err) => {
    console.log("Error " + err)
})

const settings = {
    host: '',
    password: ''
}

const redisCache = {
    client: redisClient,
    get: async (key) => {
        return await redisClient.getAsync(key)
    },
    set: async (key, data, ttl) => {
        ttl = typeof ttl === 'undefined' ? -1 : ttl;
        if (ttl > 0) {
            return await redisClient.setAsync(key, data, 'EX', ttl);
        }
        return await redisClient.setAsync(key, data);
    },
    delete: (key) => {
        return redisClient.del(key)
    }
}

module.exports = { redisClient, redisCache }
