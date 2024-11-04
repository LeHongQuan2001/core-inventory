const passport = require('passport');
const GooglePassport = require('passport-google-oauth20').Strategy;
const configs = require('../../../../configs/configs');
const AbstractStrategy = require('./abstractStrategy');

module.exports = class GoogleStrategy extends AbstractStrategy {
    constructor() {
        super();
        passport.use(new GooglePassport({
            clientID: configs.social.google.appID,
            clientSecret: configs.social.google.appSecret,
            callbackURL: configs.social.google.callbackURL,
        }, (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }));
    }

    request(req, res) {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: req.query.redirect || '/',
        })(req, res);
    }

    async callback(req, res, fn) {
        try {
            await passport.authenticate('google', (err, profile, info) => {
                if (err) {
                    fn({
                        error: err,
                        data: null
                    });
                } else if (!profile) {
                    res.status(401).send('Authentication failed');
                } else {
                    const user = {
                        id: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    }
                    fn({
                        error: false,
                        data: user
                    });
                }
            })(req, res);
        } catch (error) {
            fn({
                error: error,
                data: null
            });
        }
    }
}
