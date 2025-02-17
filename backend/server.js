const express = require('express');
const cors = require('cors');

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const axios = require('axios');


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// API for user registration
app.post('/userdata', async (req, res) => {

  // ####### Data coming from register page ##############
  // username : username,
  // email : email,
  // password : password,
  // confirmPassword : confirmPassword

  try{

      const userData = req.body;
      let users = [];

      // confirm password validation
      if (userData.password !== userData.confirmPassword){
          return res.status(400).send({
            message : "Passwords Mismatched"
          })
      }

      try {
          // read entire json file
          const fileData = await readFileAsync('dbData.json', 'utf-8');
          // if fileData not empty -> parse the string to object else return empty 
          users = fileData.trim() ? JSON.parse(fileData) : [] 
      }catch(error) {
          if (error.code !== 'ENOENT') {
            users = [];
          }else {
            console.log("Error reading file", error);
            return res.status(500).send({error : "Server error"});
          }
      }

      // Check if the user is already registered
      // stores boolean 
      const userExists = users.some(user => user.email === userData.email && user.username === userData.username);
      if (userExists) { // if true
            return res.status(400).send({message : "User already exists"})
      }

      // Check if username (unique) is already taken
      // stores boolean 
      const usernameExists = users.some(user => user.username === userData.username);
      if (usernameExists){ // if true
        return res.status(400).send({message : "Username already exists"});
      }
      
      const newUser = {
        user_id : randomString(10),
        fullname : userData.fullname,
        username : userData.username,
        preferred_language: userData.preferred_language,
        email : userData.email,
        password : userData.password
      }

      // if user is new then push into users array
      users.push(newUser);

      // write the entire array to the json file
      // use writeFile so that old file is replaced
      await writeFileAsync('dbData.json', JSON.stringify(users, null, 2));
      console.log(`User data : ${newUser} saved!`)

      return res.status(200).send({
        message : "New user data received",
        data : newUser
      });

  }catch(error){
    console.error("Error:", error);
    res.status(500).send({
      error : "Server error"
    })
  }
});

app.post('/loginValidation', async (req, res) => {

  try{

      const userData = req.body;
      let users = []
      
      try {
        const fileData = await readFileAsync('dbData.json', 'utf-8');
        users = fileData.trim() ? JSON.parse(fileData) : [] // if fileData then parse the string to object else return empty 
      }catch(error) {
        if (error.code !== 'ENOENT') {
          users = [];
        }else {
          console.log("Error reading file", error);
          return res.status(500).send({error : "Server error"});
        }
      }

      const usernameExists = users.some(user => user.email === userData.email || user.username === userData.username);
      if (!usernameExists) {
        return res.status(400).send({message : "Username does not exists ...!"});
      }

      const current_user = users.find(user => user.username === userData.username);

      const loginSuccess = users.some(user => user.username === userData.username && user.password === userData.password);
      if (loginSuccess) {
        return res.status(200).send({message : "Login Successful", fullname: current_user.fullname, username: current_user.username, email: current_user.email, preferred_language: current_user.preferred_language});
      }else{
        return res.status(400).send({message : "Password is wrong"});
      }

  }catch(error){
    console.error("Error:", error);
    res.status(500).send({
      error : "Server error"
    })
  }
});

app.get('/getUserData', async (req, res) => {
  const request = req.query.username;
  let users = [];

  try {
    const fileData = await readFileAsync('dbData.json', 'utf-8');
    users = fileData.trim() ? JSON.parse(fileData) : [] // if fileData then parse the string to object else return empty 
  }catch(error) {
    if (error.code !== 'ENOENT') {
      users = [];
    }else {
      console.log("Error reading file", error);
      return res.status(500).send({error : "Server error"});
    }
  }

  const current_user = users.find(user => user.username === request);
  
  console.log(current_user);
  
  const UserData = {
    username: current_user.username,
    email: current_user.email,
    preferred_language: current_user.preferred_language
  }

  console.log(request);
  return res.status(200).send({ "Message" : UserData });
});

async function getUserId(username){
  let users = [];

  try {
    const fileData = await readFileAsync('dbData.json', 'utf-8');
    users = fileData.trim() ? JSON.parse(fileData) : [] // if fileData then parse the string to object else return empty 
  }catch(error) {
    if (error.code !== 'ENOENT') {
      users = [];
    }else {
      console.log("Error reading file", error);
      return res.status(500).send({error : "Server error"});
    }
  }

  const current_user = users.find(user => user.username === username);
  return current_user.user_id

}


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
// const sender_language_text;    // { en: 'Hello', es: 'Hola' }
let client_list = [] 

const rooms = {}

wss.on('connection', (ws) => {

    console.log("\nConnection established.....")
    console.log(`\nNew client connected. Total clients: ${ wss.clients.size }`);

    const messageHandler = async (message) => {

      try {

        // If the data comes in the form of object, then convert it to string
        const messageStr = typeof message === "string" ? message : message.toString(); 

        // parse the string format data to object
        const parsedMessage = JSON.parse(messageStr);

        // extract value of each property of object
        const { type, room, sender, preferred_language, text } = parsedMessage;

        console.log("Type ----------->",type);  // join / message
        console.log("room ----------->",room);  
        console.log("sender ----------->",sender); 
        console.log("preferred_language ----------->",preferred_language);
        console.log("text ----------->",text);

        if (type === "join" && room) {

            // assigning extracted values to current instance of websocket
            ws.id = await getUserId(sender);
            ws.room = room;
            ws.sender = sender;
            ws.preferred_language = preferred_language;
  
            
            // create a room in rooms = { 1234 : { clients:{},language_list:[] } }
            if (!rooms[room]) {
              rooms[room] = {
                clients : new Set(),
                language_List: [],
              }
            }else{
              console.log(`${rooms[room]} room already exists !!`)
            }

            const ClientExists = [...rooms[room].clients].some(client => client.id === ws.id);
            const existingClient = [...rooms[room].clients].find(client => client.sender === ws.sender);
            console.log("####### Loggin existing client if relogging\n",existingClient);
            

            if (!ClientExists) {
              rooms[room].clients.add(ws);
            }else{
              console.log(`${ws.sender} user already exists !!`) 
              rooms[room].clients.forEach((client) => {
                console.log("sending ack to sender")
                if ((ws.sender === existingClient && client.readyState === WebSocket.OPEN && (client.room === ws.room))) {
                    console.log("Entered inside for -------------------")
                    client.send(JSON.stringify({
                    type : "joined",
                    message: `🟢 ${ws.sender} already joined room ${room}`,
                    room: room,
                    all_clients: [...rooms[room].clients].map(c => c.sender),
                  } ));
                }
                console.log("Data sent -------------------")
              });
            }
            console.log(`\nClients in room ${JSON.stringify(rooms[room].clients)}`);

            
            if (!rooms[room].language_List.includes(ws.preferred_language)) {
              rooms[room].language_List.push(ws.preferred_language);
            }

            console.log("\nLanguage list update .............", rooms[room].language_List);
            

            // rooms[room].add(ws);
            console.log(`\n✅ New client :  Username = ${ws.sender}, Language = ${ws.preferred_language} Joined room : ${room}`);

            console.log("\nRooms ----------------------------> ",rooms[room])

            rooms[room].clients.forEach((client) => {
              console.log("sending ack to sender")
              if ((client.readyState === WebSocket.OPEN && (client.room === ws.room))) {
                  console.log("Entered inside for -------------------")
                  client.send(JSON.stringify({
                  type : "join",
                  message: `🟢 ${ws.sender} joined room ${room}`,
                  room: room,
                  all_clients: [...rooms[room].clients].map(c => c.sender),
                } ));
              }
              console.log("Data sent -------------------")
            });
            
            const joinMessage = {
              message: `${ws.sender || "A user"} joined room ${ws.room || "unknown room"}`,
              all_clients: Object.keys(rooms).reduce((acc, room) => {
              acc[room] = [...rooms[room].clients].map(client => client.sender || "Unknown");
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

         if (type === "message" && ws.room && text) {

          // Store current message info {"en":"Hello"}
          // Needs to be cleared after every message, hence initialized inside 
          const sender_language_text = {}; // => {"en":"Hello"}
          

          // This object will be sent to the model (python file)
          const request_data = {
            languages : rooms[ws.room].language_List, 
            sender_message : sender_language_text
          }


            if (!sender_language_text[ws.sender]){
              sender_language_text[ws.preferred_language] = {};
            }
            sender_language_text[ws.preferred_language] = parsedMessage.text;
            
           
             try {
                console.log("🛠 Calling handleTranslation()...");
                const translation = await handleTranslation(request_data);
                
                // adding the preferred language and text of sender to object with translated text
                // if there are two or more people with same language preference, then no need for translation.
                translation[ws.preferred_language] = parsedMessage.text
                console.log("✅ Translation success:", translation);

                rooms[ws.room].clients.forEach((client) => {

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
        rooms[ws.room].clients.delete(ws);
        
        if (rooms[ws.room].clients.size === 0) {
          delete rooms[ws.room]
        }

        rooms[ws.room].clients.forEach((client) => {
          console.log("sending ack to sender")
          if ((client.readyState === WebSocket.OPEN && (client.room === ws.room))) {
              
              client.send(JSON.stringify({
              type : "join",
              message: `🟢 ${ws.sender} left room ${ws.room}`,
              room: ws.room,
              all_clients: [...rooms[ws.room].clients].map(c => c.sender),
            } ));
          }
          console.log("Data sent -------------------")
        });
      }
      const leaveMessage = {
        message: `${ws.sender || "A user"} left room ${ws.room || "unknown room"}`,
        all_clients: Object.keys(rooms).reduce((acc, room) => {
            acc[room] = [...rooms[room].clients].map(client => client.sender || "Unknown");
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

module.exports = app;