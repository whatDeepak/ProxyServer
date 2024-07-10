type Server = {
    host: string;
    port: number;
};

export class LoadBalancer {
    private servers: Server[] = [];
    private currentServerIndex = 0;

    constructor(servers: Server[]){
        this.servers = servers;
    }

    addServer(server: Server) {
        this.servers.push(server);
    }

    removeServer(server: Server) {
        const serverIndex = this.servers.indexOf(server);
        if (serverIndex !== -1) {
            this.servers.splice(serverIndex, 1);
        }
    }

    getNextServer(): Server {
        const server = this.servers[this.currentServerIndex];
        this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;
        return server;
    }
}
