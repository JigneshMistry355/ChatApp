const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// wss.setMaxListeners(20);

// wss.on('connection', (ws) => {
//     ws.on('message', (message) => {
//         console.log('Received: %s', message.toString());
//         wss.clients.forEach((client) => {

//             // Keep two brackets separate for if condition
//             // else it will not checked properly.
//             // Sender will also receive message.
//             if ((client != ws) && (client.readyState === WebSocket.OPEN)){
//                 client.send(message.toString());
//                 // client.send("response received!");
//             }
//         });
//     });
// });

wss.on('connection', (ws) => {

  console.log("\nConnection established.....")
  console.log(`New client connected. Total clients: ${wss.clients.size}`);
    
    const messageHandler = (message) => {
      // message is automatically converted/parsed to JSON object
      console.log("\nType of message received ____________ :",typeof message); // object

      console.log('\nReceived message from client  ....   : %s', message); // {"sender":"ABC","text":"i m fine"}

      console.log(`Broadcasting to ${wss.clients.size} clients`);

      wss.clients.forEach((client) => {

        console.log(`\nChecking client  ......: ${client === ws ? 'Sender' : 'Other Client'}`);

        if ((client !== ws) & (client.readyState === WebSocket.OPEN)) {

          console.log("Sending message type",typeof message) // object

          client.send(message); // message sent as object

          console.log(`\nMessage was sent to : ${JSON.stringify(ws)}`, message.toString());
          console.log("\n\n\n\n\n\n")
        }
      });
    };
  
    ws.on('message', messageHandler);
  
    // Remove the listener when the connection is closed
    ws.on('close', () => {
      ws.removeListener('message', messageHandler);
      console.log("\n############################\n Connection closed \n######################################")
    });
  });

const port = 3000;
server.listen(port, () => {
    console.log("Server Running on port ", port);
});