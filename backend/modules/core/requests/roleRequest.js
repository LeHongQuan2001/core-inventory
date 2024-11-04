const {body, param, query, check} = require('express-validator');

const store = () => {
    return [
        body('name', 'isRequired').not().isEmpty(),
        body('name', 'isLength4To200').isLength({ min: 4, max: 200 }),
        body('status').custom((value, {req}) => {
            const allowStatus = [0, 1];
            if (!allowStatus.includes(value)) {
                return Promise.reject('statusWrongFormat');
            }
            return true;
        }),
    ];
}

let roleRequest = {
    store,
};

module.exports = {roleRequest};
