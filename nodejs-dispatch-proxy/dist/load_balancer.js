"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBalancer = void 0;
var LoadBalancer = /** @class */ (function () {
    function LoadBalancer(servers) {
        this.servers = [];
        this.currentServerIndex = 0;
        this.servers = servers;
    }
    LoadBalancer.prototype.addServer = function (server) {
        this.servers.push(server);
    };
    LoadBalancer.prototype.removeServer = function (server) {
        var serverIndex = this.servers.indexOf(server);
        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    };
    LoadBalancer.prototype.getNextServer = function () {
        var server = this.servers[this.currentServerIndex];
        this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;
        return server;
    };
    return LoadBalancer;
}());
exports.LoadBalancer = LoadBalancer;
