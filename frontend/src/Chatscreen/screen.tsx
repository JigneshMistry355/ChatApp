import React, { useEffect, useState, useRef } from "react";
import { w3cwebsocket, w3cwebsocket as W3CWebSocket } from "websocket";
import { useLocation } from 'react-router-dom'
import axios from "axios";

type Chat = {
    [key : number] : {
        [key : string] : string
    }
}

type ChatArr = {
    [key : string] : string
}

class CustomW3WebSocket extends w3cwebsocket {
    id : string | null | undefined
    preferred_language : string | null | undefined
    constructor (url : string, id:string | null | undefined, preferred_language:string | null | undefined) {
        super(url);
        this.id = id;
        this.preferred_language = preferred_language
    }
}

// const  location  = useLocation();
// const {username, preferred_language} = location.state || {}

const client = new CustomW3WebSocket('ws://localhost:3000/', null, null)

export default function Screen() {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const data:string | null = params?.get('username');
    const preferred_language: string | null = params?.get('password')

    console.log("Username ------------------>",data)
    console.log("Password ------------------>",preferred_language)

    console.log("type of usename : _____",typeof data);
    console.log("type of language : _____",typeof preferred_language);

    const name_list = ['Jignesh', 'Sahil', 'Tanay', 'Deep'];

    const Chats:ChatArr[] = [
        // {ABC : "Hello, How are you?"},
        // {XYZ : "I'm Fine."},
        // {ABC : "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state?"},
        // {ABC :  "Come Here!" },
        // {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" },
        // {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" },
        // {ABC : "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state?"},
        // {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" },
    ];

    

    const [newText, setNewText] = useState('');
    const [Chat, setChats] = useState<ChatArr[]>(Chats); 
    const chatEndRef = useRef<HTMLDivElement | null>(null); 
    const [received, setReceived] = useState<string | ArrayBuffer>('')
    const [sender, setSender] = useState('');
   
    
    const username:string | undefined = data?.toString() ?? 'anonymous';
    
   if (client) {
    client.id = username
    client.preferred_language = preferred_language
    client.onopen = () => {
        console.log("Connected to websocket server")
        console.log(client)
    }
   }
    

    const handleSend = (event:React.FormEvent) => {
        event?.preventDefault();
        if (newText.trim() !== "") {
            const message = JSON.stringify({sender:username, text:newText})
            if (client?.readyState === WebSocket.OPEN){
                // Message sent as a JSON string 
                console.log("\nMessage type ::: ", typeof message) //string
                console.log("\n Message sent ::: ",message) // {sender:username, text:newText}
                client.send(message);
            }else{
                console.log("Websocket is not open")
            }
            
            setChats((prevChat) => [...prevChat, {[username] : newText}]);
            setNewText("");
        } 
    }

    const [translated_response, setTranslatedResponse] = useState('')
    // const handleTranslation = async (text:string) => {

    //     await axios.post('http://localhost:8000/get_text', 
    //         {text},
    //         )
    //     .then((response) => {
    //         setTranslatedResponse(response.data);
    //         console.log(response.data)
    //     })
    //     .catch((error) => {
    //         console.log(error.response.data.message)
    //         alert(error.response.data.message)
    //     })
    //     // navigate('/')
    //     // console.log(`Data sent ${response}`);
    //     return translated_response
    // }

    useEffect(() => {

        if (client)
        client.onmessage = async (message) => {
            try {
                let messageText: string;
    
                if (typeof message.data === 'string') {
                    // If it's already a string, use it directly
                    messageText = message.data;
                } else if (message.data instanceof ArrayBuffer) {
                    // Convert ArrayBuffer to string
                    messageText = new TextDecoder().decode(message.data);
                } else if (message.data instanceof Blob) {
                    // Convert Blob to string
                    messageText = await message.data.text();
                } else {
                    throw new Error('Unsupported message type');
                }
    
                console.log('Received message:', messageText); // Received message: {"sender":"ABC","text":"ddjdfgjh"}
    
                console.log('Received message:', typeof messageText); // string
    
                const parsedMessage = JSON.parse(messageText); // converted to object
    
                console.log('Parsed message:', parsedMessage);

    
                console.log(typeof(parsedMessage.text))
                // console.log(result)
    
                setReceived(parsedMessage.text);
                setSender(parsedMessage.sender);

            } catch (error) {
                console.error('Failed to process WebSocket message:', error);
            }
        };
    },[]);

    useEffect(() => {
        
        if (received && sender) {
            console.log("Received text : ", received);

            setChats((prevChat) => [...prevChat, {[sender] : received.toString()}]);
        }
        
    },[received, sender])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior:'smooth'});
    }, [Chat])

    // const Chats = {
    //     ABC : "Hello, How are you?",
    //     XYZ : "I'm Fine.",
        
    // }

    // const Chats:Chat = {
    //     1 : {
    //         ABC : "Hello, How are you?"
    //     },
    //     2 : {
    //         XYZ : "I'm Fine."
    //     },
    //     3 : {
    //         ABC : "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state?"
    //     }
    // }

    // Chats[4] = {ABC :  "Come Here!" } ;
    // Chats[5] = {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" } ;
    // Chats[6] = {ABC :  "Come Here!" } ;
    // Chats[7] = {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" } ;
    // Chats[8] = {ABC :  "Come Here!" } ;
    // Chats[9] = {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" } ;
    // Chats[10] = {ABC :  "Come Here!" } ;
    // Chats[11] = {XYZ :  "React Navigation's native stack navigator provides a way for your app to transition between screens and manage navigation history. If your app uses only one stack navigator then it is conceptually similar to how a web browser handles navigation state!" } ;
    // console.log(Chats)

    return (
        <div className="flex flex-col h-screen w-screen bg-slate-200">
           <div className="flex h-1/6 min-h-20 bg-gradient-to-b from-amber-600 to-white items-center justify-center">
                <h1 className="text-white font-bold text-2xl font-mono text-center justify-center items-center">Chat Screen</h1>
           </div>
           <div className="flex flex-row flex-grow h-5/6">
                <div className="w-1/4 bg-white">
                    {name_list.map((names, index) => (
                        <div key={index} className="flex items-center h-11 px-4 shadow-md border-separate border bg-gray-100">
                            <h5 className="text-gray-600">{names}</h5>
                        </div>
                    ))}
                </div>
                <div className="flex flex-grow justify-between flex-col bg-gradient-to-b from-gray-200 min-h">
                    <div className="flex h-10 items-start shadow-xl mb-4 bg-white w-full">
                        <p className="">Chat : ROOM ID</p>
                    </div>
                    
                    <div className="flex flex-col overflow-y-auto items-start justify-start">
                        {Chat.map((name, index) => (
                            <div key={index} className="flex flex-grow flex-col w-full flex-wrap px-4 py-1">
                                {Object.entries(name).map(([key, value]) => (
                                    <div key={key}>
                                        {key === username ? (
                                            <div className="flex justify-end">
                                                <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4  bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
                                                    <div className="text-xs pt-1 font-bold text-blue-800">
                                                        You
                                                    </div>
                                                    {value.toString()}
                                                </p>
                                            </div>
                                            
                                        ):(
                                            <div className="flex justify-start">
                                                <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4  bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
                                                    <div className="text-xs pt-1 font-bold text-blue-800">
                                                        {key}
                                                    </div>
                                                    {value.toString()}
                                                </p>
                                            </div>
                                            
                                        )}
                                        
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div ref={chatEndRef} /> {/* Auto-scroll target */}
                    </div>
                    

                    <div className="flex flex-row justify-start min-h-14 border border-gray-400 items-center">
                        <input 
                            className="w-5/6 mx-4 h-8 shadow-xl"
                            type="text"  
                            value={newText}
                            onChange={(event) => setNewText(event.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSend(e)
                                }
                            }}
                            />
                        <button 
                            className="flex bg-blue-700 p-1 px-2 rounded-md text-white font-mono"
                            onClick = {handleSend}
                            >
                            Send
                        </button>
                    </div>
                    
                    
                </div>
           </div>
        </div>
    )
}

// {Object.entries(Chats).map(([key, value]) => (
    // <div key={key} className="flex flex-grow flex-col w-full flex-wrap px-4 py-1">
        {/* {key === "ABC" ? (
            <div className="">
                <p className="w-fit border border-green-500 rounded-md px-4 text-left bg-green-200"  key={key}>{value.toString()}</p>
            </div>
            
        ) : (
            <div className="flex justify-end">
                <p className="w-fit border border-green-500 rounded-md px-4 text-right bg-green-200" key={key}>{value.toString()}</p>
            </div>
        )} */}

//         {Object.entries(value).map(([k, v]) => (
//             <div key={k}>
//                 {k === "ABC" ? (
//                 <div className="flex justify-start">
//                     <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4  bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg"  key={k}>{v.toString()}</p>
//                 </div>
//                 ) : (
//                 <div className="flex justify-end">
//                     <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4 bg-gradient-to-b from-gray-400 to-gray-200 shadow-2xl" key={k}>{v.toString()}</p>
//                 </div>
//                 )}
//             </div>
//         ))}
//     </div>

    
// ))}