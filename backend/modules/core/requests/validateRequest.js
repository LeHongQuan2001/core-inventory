const {validationResult} = require('express-validator');

const validated = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: 0,
            code: 422,
            errors: errors.array(),
            data: res.data || {}
        })
        return false;
    }
    return true;
}

let validatedRequest = {
    validated
};

module.exports = validatedRequest;
