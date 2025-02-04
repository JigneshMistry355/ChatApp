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

const handleTranslation = async (text) => {
  try {
    console.log("Loggging .......................................",text)
  const response = await axios.post('http://localhost:8000/get_text', text );
  
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
  // navigate('/')
  // console.log(`Data sent ${response}`);

}

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


let target_language = {};
// { en: 'Hello', es: 'hello' }

wss.on('connection', (ws) => {

    console.log("\nConnection established.....")
    console.log(`\nNew client connected. Total clients: ${ wss.clients.size }`);

    
    
    const messageHandler = async (message) => {
      // message is automatically converted/parsed to JSON object

      

      try {
        const messageStr = typeof message === "string" ? message : message.toString(); 

        const parsedMessage = JSON.parse(messageStr);

        ws.sender = parsedMessage.sender
        ws.preferred_language = parsedMessage.preferred_language
        console.log(`\n✅ Sender of message :  Username = ${ws.sender}, Language = ${ws.preferred_language}`);

        if (parsedMessage.text === 'connection_request'){
          return;
        }

        // console.log("\nType of message received ____________ :",typeof parsedMessage); // object

        console.log('\nReceived message object from client  ....   : %s', parsedMessage); // {"sender":"ABC","text":"i m fine"}

        console.log(`\nBroadcasting to ${wss.clients.size -1} other clients`);

        console.log("\nWaiting for translation model to translate ..... ")

        console.log("\nmesage text -------->", parsedMessage.text)
        console.log("\nType of mesage text -------->",typeof parsedMessage.text)

        console.log("111111  ABABABAB -----> ", target_language)
        console.log(target_language[ws.sender])

        if (!target_language[ws.sender]){
          target_language[ws.preferred_language] = {}
        }
        target_language[ws.preferred_language] = parsedMessage.text
        

        console.log("22222  ABABABAB -----> ", target_language)
        
        const translation = await handleTranslation(target_language);

        console.log("\nTranslation result:", translation);

        console.log("\nSending translated data to all ====> ",typeof translation);

        // console.log("\nTarget language list ------>", target_language)

        wss.clients.forEach((client) => {

          console.log(`\nSending reply to client  ......: ${client === ws ? 'Sender' : 'Other Client'}`);
  
          if ((client !== ws) && (client.readyState === WebSocket.OPEN)) {
  
            // console.log("Sending message type",typeof translation) // object
            console.log(`Sending reply to :  Username: ${client.sender}, Language: ${client.preferred_language}`);

            parsedMessage.text = translation;
  
            client.send(JSON.stringify(parsedMessage)); // message sent as object
  
            console.log(`\nMessage was sent to : ${JSON.stringify(ws)}`);
            console.log("\n\n\n\n\n\n")
          }
        });

      }catch(error){
        console.error("Error parsing message:", error);
      }
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

app.listen(3001, () => {
  console.log("API running on 3001")
})