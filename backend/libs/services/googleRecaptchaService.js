const configs = require("../../configs/configs");
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));
const googleRecaptchaService = {
    verify: async (captcha) => {
        const secretKey = configs.google.recaptcha.secretKey;
        const url = `${configs.google.recaptcha.url}?secret=${secretKey}&response=${captcha}`;
        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
        }
        const rawResponse = await fetch(url, options);
        const response = await rawResponse.json();
        return typeof response.success !== 'undefined' && response.success === true ? true : false;
    },
    verifyV3: async (captcha) => {
        const secretKey = configs.google.recaptchaV3.secretKey;
        const url = `${configs.google.recaptchaV3.url}?secret=${secretKey}&response=${captcha}`;
        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
        }
        const rawResponse = await fetch(url, options);
        const response = await rawResponse.json();
        return typeof response.success !== 'undefined' && response.success === true ? true : false;
    }
}

module.exports = googleRecaptchaService
