'use strict';
const md5 = require('md5')
const {
    Model
} = require('sequelize');
const { redisCache } = require('../../libs/cache/redisCache')

const cachePrefix = 'CACHE_MODEL_INVENTORY_'

class CoreModel extends Model {
    static cache = false
    static expireTime = 30 * 24 * 60 * 60;

    static enableCache() {
        this.cache = true
        return this
    }

    static disableCache() {
        this.cache = false
        return this
    }

    static async getCache(key) {
        const cache = await redisCache.get(cachePrefix + key)
        return cache == null ? false : JSON.parse(cache)
    }

    static setCache = async (key, data) => {
        return await redisCache.set(cachePrefix + key, JSON.stringify(data), this.expireTime)
    }

    static deleteCache = async (key) => {
        return await redisCache.delete(cachePrefix + key)
    }
}

module.exports = CoreModel
