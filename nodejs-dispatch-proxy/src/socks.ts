import * as net from 'net'
import { LoadBalancer } from './load_balancer';

const server = net.createServer();
const LoadBalancerList = new LoadBalancer([
    { host: "192.168.1.6", port : 80},
    { host: "100.127.255.249", port : 80},
])

server.on('connection', (clientConn) => {
    console.log('client connected!')
    clientConn.once('data', (data) => {
        const version = data[0];
        const nMethods = data[1];
        console.log('SOCKS version: ', version);
        clientConn.write(Buffer.from([0x05, 0xe0])); // No authentication required

        clientConn.once('data', (requestData) => {
            const version = requestData[0];
            const cmd = requestData[1];
            const addressType = requestData[3];
            let address: string;
            let port: number;

            if(version!== 0x05){
                console.log("Unsupported SOCKS Version:", version);
                clientConn.end();
                return;
            }

            if(cmd!== 0x01){
                console.log("Unsupported command:", cmd);
                clientConn.end();
                return;
            }

            if (addressType === 0x01) { // Ipva
                address = requestData.slice(4, 8).join('.');
                port = requestData.readUInt16BE(8);
              } else if (addressType === 0x03) { // Domain name
                const domainLength = requestData[4];
                address = requestData.slice(5, 5 + domainLength).toString();
                port = requestData.readUInt16BE(5 + domainLength);
              } else {
                console.error('Unsupported address type:', addressType);
                clientConn.end();
                return;
              }
              
              const targetServer = LoadBalancerList.getNextServer()
              console.log(`using ${targetServer.host}:${targetServer.port}`)
              
              const destinationConn = net.createConnection({ host: targetServer.host, port: targetServer.port }, () => {
                console.log("connected to destination");
                clientConn.write(Buffer.from([0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
                destinationConn.pipe(clientConn);
                clientConn.pipe(destinationConn);
              });
              
        });
    });
})

server.listen(8080, () => {
    console.log('SOCKS server listening on port 8080');
})