import http from "http";
import { Server as WebSocketServer, WebSocket } from "ws";
import {app} from "../index"; 
import { setupWebSocket } from "../utils/wsServer"; 

const PORT = 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


const wss: WebSocketServer = setupWebSocket(server);

export const broadcastMessage = (msg: any) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "new_message", data: msg }));
    }
  });
};
