const {body} = require('express-validator');

const login = () => {
    return [
        body('email', 'emailIsRequire').not().isEmpty(),
        body('password', 'passwordIsRequire').not().isEmpty()
    ];
}

let authRequest = {
    login
};

module.exports = {authRequest};
