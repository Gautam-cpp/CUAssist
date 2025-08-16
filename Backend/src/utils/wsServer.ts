import { Server as HttpServer } from "http";
import { Server as WebSocketServer, WebSocket } from "ws";

export function setupWebSocket(server: HttpServer) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WebSocket) => {
        console.log("WebSocket client connected");

        ws.on("message", (message: string) => {
        });
    });

    
    (wss as any).broadcast = (data: string) => {
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    return wss;
}
