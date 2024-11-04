(() => {
    const {APP_SDK_URL: P} = {
        APP_VERSION: "1.0.0",
        APP_PLATFORM: "web",
        APP_DOMAIN: "https://dev.notify-service.admicro.vn/v3",
        APP_SDK_URL: "https://static.contineljs.com/not",
        APP_DEBUG: "true"
    };
    importScripts(P + "/web/1.0.0/vc-push-notify-service-worker.js")
})();
