"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
function isGoodInterface(iface) {
    return iface.family === 'IPv4' && !iface.internal;
}
function detect_interfaces() {
    var networkInterfaces = os.networkInterfaces();
    var interfaceList = [];
    for (var name_1 in networkInterfaces) {
        var interfaces = networkInterfaces[name_1];
        if (interfaces) {
            for (var _i = 0, interfaces_1 = interfaces; _i < interfaces_1.length; _i++) {
                var iface = interfaces_1[_i];
                if (isGoodInterface(iface)) {
                    interfaceList.push({
                        name: name_1,
                        address: iface.address,
                        internal: iface.internal,
                        family: iface.family
                    });
                }
            }
        }
    }
    return interfaceList;
}
var result = detect_interfaces();
console.log("Netwok Interfaces", result);
