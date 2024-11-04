// abstractStrategy.js
module.exports = class AbstractStrategy {
    request(req, res, next) {
        throw new Error('Not implemented');
    };

    callback(req, res, next) {
        throw new Error('Can not handle');
    }
}
