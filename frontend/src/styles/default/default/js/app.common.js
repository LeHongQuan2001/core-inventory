const commons = {
    notify: {
        success: function(title, message) {
            AppNoty.success([message]);
        },
        error: function(title, message) {
            AppNoty.error([message]);
        }
    }
}
