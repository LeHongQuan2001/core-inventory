// FacebookStrategy.js
const passport = require('passport');
const FacebookPassport = require('passport-facebook').Strategy;
const configs = require('../../../../configs/configs');
const AbstractStrategy = require('./abstractStrategy');

module.exports = class FacebookStrategy extends AbstractStrategy {
    constructor() {
        super();
        passport.use(new FacebookPassport({
            clientID: configs.social.facebook.appID,
            clientSecret: configs.social.facebook.appSecret,
            callbackURL: configs.social.facebook.callbackURL,
            profileFields: ['id', 'displayName', 'photos', 'email']
        }, (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }));
    }

    request(req, res) {
        passport.authenticate('facebook', {
            scope: ['email'],
            state: req.query.redirect || '/',
        })(req, res);
    }

    callback(req, res, fn) {
        passport.authenticate('facebook', (err, profile, info) => {
            if (err) {
                next(err);
            } else if (!profile) {
                res.status(401).send('Authentication failed');
            } else {
                const user = {
                    id: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                }

                fn(user);
            }
        })(req, res);
    }
}
