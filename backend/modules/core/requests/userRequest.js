const {body, param, query, check} = require('express-validator');

const store = () => {
    return [
        body('status').custom((value, {req}) => {
            const allowStatus = [-1, 0, 1];
            if (!allowStatus.includes(value)) {
                return Promise.reject('statusWrongFormat');
            }
            return true;
        }),
    ];
}

let userRequest = {
    store
};

module.exports = {userRequest};
