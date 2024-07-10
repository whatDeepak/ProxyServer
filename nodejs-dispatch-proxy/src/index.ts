import * as os from 'os'

type NetworkInterface = {
    name: string,
    address: string,
    internal: boolean, //is it a loopback
    family: string, //ipv4 or ipv6
}

function isGoodInterface(iface: os.NetworkInterfaceInfo): boolean {
    return iface.family === 'IPv4' && !iface.internal
}

function detect_interfaces(): NetworkInterface[] {
    const networkInterfaces = os.networkInterfaces();
    const interfaceList: NetworkInterface[] = []

    for (const name in networkInterfaces) {
        const interfaces = networkInterfaces[name];
        if (interfaces) {
            for (const iface of interfaces) {
                if (isGoodInterface(iface)) {
                    interfaceList.push({
                        name,
                        address: iface.address,
                        internal: iface.internal,
                        family: iface.family
                    });
                }
            }
        }
    }


    return interfaceList
}

const result = detect_interfaces()

console.log("Netwok Interfaces", result)