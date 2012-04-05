# node-simplerouter
An awfully simple regex parameter based HTTP router

## Usage

    var http = require('http');
    var simplerouter = require('simplerouter');

    var router = simplerouter({
        url: '/hello',
        action: function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello World\n');
        },
        method: 'GET' // optional
    });

    http.createServer(router).listen(1337, '127.0.0.1');
