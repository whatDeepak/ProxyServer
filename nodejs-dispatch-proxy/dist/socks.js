"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var load_balancer_1 = require("./load_balancer");
var server = net.createServer();
var LoadBalancerList = new load_balancer_1.LoadBalancer([
    { host: "192.168.1.6", port: 80 },
    { host: "100.127.255.249", port: 80 },
]);
server.on('connection', function (clientConn) {
    console.log('client connected!');
    clientConn.once('data', function (data) {
        var version = data[0];
        var nMethods = data[1];
        console.log('SOCKS version: ', version);
        clientConn.write(Buffer.from([0x05, 0xe0])); // No authentication required
        clientConn.once('data', function (requestData) {
            var version = requestData[0];
            var cmd = requestData[1];
            var addressType = requestData[3];
            var address;
            var port;
            if (version !== 0x05) {
                console.log("Unsupported SOCKS Version:", version);
                clientConn.end();
                return;
            }
            if (cmd !== 0x01) {
                console.log("Unsupported command:", cmd);
                clientConn.end();
                return;
            }
            if (addressType === 0x01) { // Ipva
                address = requestData.slice(4, 8).join('.');
                port = requestData.readUInt16BE(8);
            }
            else if (addressType === 0x03) { // Domain name
                var domainLength = requestData[4];
                address = requestData.slice(5, 5 + domainLength).toString();
                port = requestData.readUInt16BE(5 + domainLength);
            }
            else {
                console.error('Unsupported address type:', addressType);
                clientConn.end();
                return;
            }
            var targetServer = LoadBalancerList.getNextServer();
            console.log("using ".concat(targetServer.host, ":").concat(targetServer.port));
            var destinationConn = net.createConnection({ host: targetServer.host, port: targetServer.port }, function () {
                console.log("connected to destination");
                clientConn.write(Buffer.from([0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
                destinationConn.pipe(clientConn);
                clientConn.pipe(destinationConn);
            });
        });
    });
});
server.listen(8080, function () {
    console.log('SOCKS server listening on port 8080');
});
