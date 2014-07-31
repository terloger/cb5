Ext.define('CB.service.File', {
    
    requires: [
        'CB.data.Connection'
    ],
    
    singleton: true,
    
    upload: function(config) {
        var connection = Ext.create('CB.data.Connection');

        console.log('connection', connection);
        
        // execute request
        connection.request({
            url: '/api/upload-file/',
            xmlData: config.file,
            timeout : 120000, // set timeout to 120 seconds
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Location-Id': config.location.get('id'),
                'X-File-Name': config.file.name
            },
            progress: function(e) {
                console.log('progress', 'position', e.position, 'total', e.total);
            },
            success: function(response, operation) {
                try {
                    var result = Ext.decode(response.responseText, true);
                    if (result.success) {
                        if (config.success) {
                            config.success.call(config.scope, result);
                        }
                    } else {
                        if (config.failure) {
                            config.failure.call(config.scope, result.message ? result.message : 'Unable to upload File!');
                        }
                    }
                } catch (e) {
                    if (config.failure) {
                        config.failure.call(config.scope, 'Error processing response from the server!');
                    }
                }
            },
            failure: function(response, operation) {
                console.log('failure');
                console.log('response', response);
                console.log('operation', operation);
                console.log('config', config);

                if (config.failure) {
                    config.failure.call(config.scope, 'Error ' + response.status + ': ' + response.statusText);
                }
            }
        });
    }
    
});