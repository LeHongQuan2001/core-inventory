const GoogleStrategy = require('./strategies/googleStrategy');
const FacebookStrategy = require('./strategies/facebookStrategy');
//TODO
// const LocalStrategy = require('./strategies/localStrategy')
module.exports = class StrategyFactory {
    static createStrategy(provider) {
        switch (provider) {
            case 'google':
                return new GoogleStrategy();
            case 'facebook':
                return new FacebookStrategy();
            // TODO
            // case 'local':
            //     return new LocalStrategy();
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }
}
