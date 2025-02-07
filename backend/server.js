const express = require('express');
const http = require('http');
const cors = require('cors')
const WebSocket = require('ws');
const { error } = require('console');
const axios = require('axios');
const { text } = require('stream/consumers');
// const MongoClient = require('mongodb').MongoClient

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const userDB = {

}

app.post('/userdata', (req, res) => {
  try{
    const userData = req.body;
    if (userData.password !== userData.confirmPassword){
      return res.status(400).send({
        message : "Passwords Mismatched"
      })
    }
    // console.log(userData)
    res.status(200).send({
      message : "New user data received",
      data : userData
    });
    let id = 101
    
    const dbData = {
      username : userData.username,
      email : userData.email,
      password : userData.password
  }
  userDB[id] = dbData

  console.log(userDB)
  }catch(error){
    res.status(500).send({
      error : "Server error"
    })
  }
});

function randomString(length) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

  if (! length) {
      length = Math.floor(Math.random() * chars.length);
  }

  var str = '';
  for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

const handleTranslation = async (text) => {
  try {
    console.log("Loggging .......................................",JSON.stringify(text))
  const response = await axios.post( 'http://localhost:8000/get_text', text, { headers: { "Content-Type": "application/json" }});
  
      console.log("Response in function ---> ",response.data)
      console.log("Response type in function ---> ",typeof response.data)
      return response.data;
      
  }
  catch(error) {
      // console.log(error.response.data.message)
      console.error("Error translating:", error.response?.data?.message || error.message);
        return { error: "Translation failed" }; // Return an error message
      // alert(error.response.data.message)
  }
}


let language_List = [];           //  [ 'en', 'es' ]
let sender_language_text;    // { en: 'Hello', es: 'Hola' }
let client_list = [] 

const rooms = {}

wss.on('connection', (ws) => {

    console.log("\nConnection established.....")
    console.log(`\nNew client connected. Total clients: ${ wss.clients.size }`);

    const messageHandler = async (message) => {

      // Store current message info {"en":"Hello"}
      // Needs to be cleared after every message, hence initialized inside 
      sender_language_text = {};

      // This object will be sent to the model (python file)
      let request_data = {
        languages : language_List,
        sender_message : sender_language_text
      }
     
      try {

        const messageStr = typeof message === "string" ? message : message.toString(); 

        const parsedMessage = JSON.parse(messageStr);

        const { type, room, sender, preferred_language, text } = parsedMessage;

        console.log("Type ----------->",type);
        console.log("room ----------->",room);
        console.log("sender ----------->",sender);
        console.log("preferred_language ----------->",preferred_language);
        console.log("text ----------->",text);

        if (type === "join" && room) {
            ws.id = randomString(10);
            ws.room = room;
            ws.sender = sender;
            ws.preferred_language = preferred_language;

            if (!client_list.includes(ws.sender)) {
              client_list.push(ws.sender);
            }

            if (!language_List.includes(ws.preferred_language)) {
              language_List.push(ws.preferred_language);
            }
            console.log("\nLanguage list update .............", language_List);
            
            if (!rooms[room]) {
              rooms[room] = new Set();
            }else{
              console.log(`${rooms[room]} already exists !!`)
            }

            rooms[room].add(ws);
            console.log(`\n✅ New client :  Username = ${ws.sender}, Language = ${ws.preferred_language} Joined room : ${room}`);

            console.log("\nRooms ----------------------------> ",rooms)

            rooms[room].forEach((client) => {
              console.log("sending ack to sender")
              if ((client.readyState === WebSocket.OPEN && (client.room === ws.room))) {
                  console.log("Entered inside for -------------------")
                  client.send(JSON.stringify({
                  type : "join",
                  message: `🟢 ${ws.sender} joined room ${room}`,
                  room: room,
                  all_clients: [...rooms[room]].map(c => c.sender),
                } ));
              }
              console.log("Data sent -------------------")
            });
            
            const joinMessage = {
              message: `${ws.sender || "A user"} joined room ${ws.room || "unknown room"}`,
              all_clients: Object.keys(rooms).reduce((acc, room) => {
              acc[room] = [...rooms[room]].map(client => client.sender || "Unknown");
              return acc;
            }, {})
            }
            console.log(JSON.stringify(joinMessage));
            // wss.clients.forEach((client) => {
            //   if ((client.readyState === WebSocket.OPEN) && (client.room === ws.room)){
            //     client.send(JSON.stringify({message : `Joined room ${room}`, room: room, all_clients:client_list}));
            //   }
            // })
            // ws.send(JSON.stringify({message : `Joined room ${room}`, room: room, all_clients:client_list}));
        }

        else if (type === "message" && ws.room && text) {

            if (!sender_language_text[ws.sender]){
              sender_language_text[ws.preferred_language] = {};
            }
            sender_language_text[ws.preferred_language] = parsedMessage.text;
           
             try {
                console.log("🛠 Calling handleTranslation()...");
                const translation = await handleTranslation(request_data);
                console.log("✅ Translation success:", translation);

                wss.clients.forEach((client) => {

                  console.log(`\nSending reply to client  ......: ${client === ws ? 'Sender' : 'Other Client'}`);

                  console.log("#########################################################################")
                  console.log("Client Room : ", client.room);
                  console.log("ws room : ", ws.room);
          
                  if ((client !== ws) && (client.readyState === WebSocket.OPEN) && (client.room === ws.room)) {
          
                    // console.log("Sending message type",typeof translation) // object
                    console.log("\nTranslated text -----------> ",translation[client.preferred_language])
        
                    console.log(`Sending reply to :  Username: ${client.sender}, Language: ${client.preferred_language} on room ${client.room}`);
        
                    parsedMessage.text = translation[client.preferred_language];
          
                    client.send(JSON.stringify(parsedMessage)); // message sent as object
                    
          
                    // console.log(`\nMessage was sent to : ${JSON.stringify(ws)}`);
                    console.log("\n\n\n\n\n\n")
                  }
                });

              } 
              catch (error) {
                  console.error("❌ Translation failed:", error);
              }
        }

          // ws.sender = parsedMessage.sender
          // ws.preferred_language = parsedMessage.preferred_language
          // console.log(`\n✅ Sender of message :  Username = ${ws.sender}, Language = ${ws.preferred_language}`);

        // if (!language_List.includes(ws.preferred_language)) {
        //   language_List.push(ws.preferred_language)
        // }

        // console.log("\nLanguage list update .............", language_List);

        // if (parsedMessage.text === 'connection_request'){
        //   return;
        // }

        // console.log("\nType of message received ____________ :",typeof parsedMessage); // object

        // console.log('\nReceived message object from client  ....   : %s', parsedMessage); 
        //   { 
        //      sender: 'Jignesh', 
        //      preferred_language: 'en', 
        //      text: 'Hello' 
        //   }

        // console.log(`\nBroadcasting to ${wss.clients.size -1} other clients`);

        // console.log("\nWaiting for translation model to translate ..... ")

        // console.log("\nmesage text -------->", parsedMessage.text)
        // console.log("\nType of mesage text -------->",typeof parsedMessage.text)

        // console.log("111111  ABABABAB -----> ", sender_language_text)
        // console.log(sender_language_text[ws.sender])

        // if (!sender_language_text[ws.sender]){
        //   sender_language_text[ws.preferred_language] = {}
        // }
        // sender_language_text[ws.preferred_language] = parsedMessage.text
        

        // console.log("22222  ABABABAB -----> ", sender_language_text)
        
        // const translation = await handleTranslation(request_data);

        // console.log("\nTranslation result:", translation);

        // console.log("\nSending translated data to all ====> ",typeof translation);

        // console.log("\nTarget language list ------>", sender_language_text)

        // console.log("\n\n\nFinal data for Model ............................", request_data)

        // wss.clients.forEach((client) => {

        //   console.log(`\nSending reply to client  ......: ${client === ws ? 'Sender' : 'Other Client'}`);
  
        //   if ((client !== ws) && (client.readyState === WebSocket.OPEN)) {
  
        //     // console.log("Sending message type",typeof translation) // object
        //     console.log("\nTranslated text -----------> ",translation[client.preferred_language])

        //     console.log(`Sending reply to :  Username: ${client.sender}, Language: ${client.preferred_language}`);

        //     parsedMessage.text = translation[client.preferred_language];
  
        //     client.send(JSON.stringify(parsedMessage)); // message sent as object
  
        //     console.log(`\nMessage was sent to : ${JSON.stringify(ws)}`);
        //     console.log("\n\n\n\n\n\n")
        //   }
        // });

      }catch(error){
        console.error("Error parsing message:", error);
      }
    };
  
    ws.on('message', messageHandler);
  
    // Remove the listener when the connection is closed
    ws.on('close', () => {
      ws.removeListener('message', messageHandler);
      if (ws.room && rooms[ws.room]) {
        rooms[ws.room].delete(ws);
        
        if (rooms[ws.room].size === 0) {
          delete rooms[ws.room]
        }
      }
      const leaveMessage = {
        message: `${ws.sender || "A user"} left room ${ws.room || "unknown room"}`,
        all_clients: Object.keys(rooms).reduce((acc, room) => {
            acc[room] = [...rooms[room]].map(client => client.sender || "Unknown");
            return acc;
        }, {})
      };

      console.log(JSON.stringify(leaveMessage));
     
      console.log("\n############################\n Connection closed \n######################################")
    });
  });

const port = 3000;
server.listen(port, () => {
    console.log("Server Running on port ", port);
});

app.listen(3001, () => {
  console.log("API running on 3001")
})