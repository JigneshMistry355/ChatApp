import React, { useEffect, useState, useRef } from "react";
import { w3cwebsocket } from "websocket";
import { useLocation } from 'react-router-dom'
// import axios from "axios";

// type Chat = {
//     [key : number] : {
//         [key : string] : string
//     }
// }

type ChatArr = {
    [key : string] : string
}

class CustomW3WebSocket extends w3cwebsocket {
    type : string | null | undefined
    room : string | null | undefined
    preferred_language : string | null | undefined
    username : string | null | undefined
    text : string | null | undefined

    constructor (url : string, preferred_language:string | null | undefined, username : string | null | undefined, text:string | null | undefined, type : string | null | undefined, room : string | null | undefined) {
        super(url);
        this.type = type
        this.room = room
        this.preferred_language = preferred_language
        this.username = username
        this.text = text

        this.onopen = () => {
            console.log("Connected to WebSocket server ...  ");
            if (this.room)
            this.send(
                JSON.stringify({
                    type : this.type,
                    room: this.room,
                    sender : this.username,
                    preferred_language : this.preferred_language,
                    text : null
                    
                })
            )
        }
    }
}

export default function Screen() {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const data:string | null = params?.get('username');
    const preferred_language: string | null = params?.get('preferred_language')
    const name_list = ['Edit Profile', 'New Chat', 'Settings', 'Logout'];
    const client = useRef<CustomW3WebSocket | null>(null);
    const [newText, setNewText] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    
    const chatEndRef = useRef<HTMLDivElement | null>(null); 
    const [received, setReceived] = useState<string | ArrayBuffer>('')
    const [sender, setSender] = useState('');
    const [roomID, setRoomID] = useState('');
    const [client_list, set_client_list] = useState([]);

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

    const [Chat, setChats] = useState<ChatArr[]>(Chats); 

    const create_connection = (event:React.FormEvent) => {
        event?.preventDefault();
        if (!roomID) {
            console.log("❌ Room ID is required.");
            return;
        }
        setIsConnected(true)
        console.log("✅ Room ID Submitted:", roomID);
    }

    // const [client, setClient] = useState<CustomW3WebSocket>();
    

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const username = urlParams.get("username");
        const password = urlParams.get("preferred_language");

        if (!username || !password) {
            console.log("❌ No login credentials found. WebSocket not connected.");
            return;
        }
        console.log(username, password)

        if (!roomID) {
            console.log("❌ Room ID is required.");
            return;
        }

        if (!client.current || client.current.readyState !== WebSocket.OPEN) {
            console.log("🔑 Logging in and establishing WebSocket connection...");

            // Create WebSocket connection only after login
            client.current = new CustomW3WebSocket('ws://localhost:3000/', password, username, null, "join", roomID);
            // setClient(newClient);

            console.log("#############################################################")
            console.log(client.current.username);

            // client.current.onopen = () => console.log("🟢 WebSocket Connected");
            client.current.onclose = () => console.log("🔴 WebSocket Disconnected");
            client.current.onerror = (err) => console.error("⚠️ WebSocket Error:", err);
            client.current.onmessage = async (message) => {
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
    
                    // {"message":"Tanay joined room 4321","all_clients":{"1234":["Sahil","Jignesh"],"4321":["Tanay"]}}
        
                    console.log('Received message:', messageText); // Received message: {"sender":"ABC","text":"ddjdfgjh"}
        
                    console.log('Received message:', typeof messageText); // string
        
                    const parsedMessage = JSON.parse(messageText); // converted to object
        
                    console.log('Parsed message:', parsedMessage);
    
                    console.log("Connection Acknowledgement:")
                    console.log(parsedMessage.message, parsedMessage.all_clients)

                    const { type, room } = parsedMessage;

                    if (type === "join") {
                        setRoomID(room);
                        set_client_list(parsedMessage.all_clients);
                    }
    
        
                    console.log(typeof(parsedMessage.text))
                    // console.log(result)
                    // alert(parsedMessage.message);
                    setReceived(parsedMessage.text);
                    setSender(parsedMessage.sender);
                    
                    
    
                } catch (error) {
                    console.error('Failed to process WebSocket message:', error);
                }
                
                };
        }else {
            console.log("⚠️ WebSocket already connected.");
        }
        // if (username && password && !client.current) {
        //     console.log("🔑 Logging in and establishing WebSocket connection...");

        //     // Create WebSocket connection only after login
        //     client.current = new CustomW3WebSocket('ws://localhost:3000/', password, username, null, "join", "room1");
        //     // setClient(newClient);
        // } else {
        //     console.log("❌ No login credentials found. WebSocket not connected.");
        // }

        // Cleanup WebSocket connection on unmount
        // return () => {
        //     if (client.current) {
        //         console.log("🔴 Closing WebSocket connection...");
        //         client.current.close();
        //         client.current = null;
        //     }
        // };

    }, [isConnected]);
    
    const username:string | undefined = data?.toString() ?? 'anonymous';
    
//    if (client) {
//     client.id = username
//     client.preferred_language = preferred_language
//     client.username = username
//     client.onopen = () => {
//         console.log("Connected to websocket server")
//         console.log(client)
//     }
//    }
    

    const handleSend = (event:React.FormEvent) => {
        event?.preventDefault();
        if (newText.trim() !== "") {
            const message = JSON.stringify({type:"message", room: "room1", sender:username, preferred_language: preferred_language, text:newText})
            if (client.current?.readyState === WebSocket.OPEN){
                // Message sent as a JSON string 
                console.log("\nMessage type ::: ", typeof message) //string
                console.log("\n Message sent ::: ",message) // {sender:username, text:newText}
                client.current.send(message);
            }else{
                console.log("Websocket is not open")
            }
            
            setChats((prevChat) => [...prevChat, {[username] : newText}]);
            setNewText("");
        } 
    }

    useEffect(() => {

        // if (client.current) {
        // client.current.onmessage = async (message) => {
        //     try {
        //         let messageText: string;
    
        //         if (typeof message.data === 'string') {
        //             // If it's already a string, use it directly
        //             messageText = message.data;
        //         } else if (message.data instanceof ArrayBuffer) {
        //             // Convert ArrayBuffer to string
        //             messageText = new TextDecoder().decode(message.data);
        //         } else if (message.data instanceof Blob) {
        //             // Convert Blob to string
        //             messageText = await message.data.text();
        //         } else {
        //             throw new Error('Unsupported message type');
        //         }

        //         // {"message":"Tanay joined room 4321","all_clients":{"1234":["Sahil","Jignesh"],"4321":["Tanay"]}}
    
        //         console.log('Received message:', messageText); // Received message: {"sender":"ABC","text":"ddjdfgjh"}
    
        //         console.log('Received message:', typeof messageText); // string
    
        //         const parsedMessage = JSON.parse(messageText); // converted to object
    
        //         console.log('Parsed message:', parsedMessage);

        //         console.log("Connection Acknowledgement:")
        //         console.log(parsedMessage.message, parsedMessage.all_clients)

    
        //         console.log(typeof(parsedMessage.text))
        //         // console.log(result)
        //         // alert(parsedMessage.message);
        //         setReceived(parsedMessage.text);
        //         setSender(parsedMessage.sender);
        //         setRoomID(parsedMessage.room);
        //         set_client_list(parsedMessage.all_clients);

        //     } catch (error) {
        //         console.error('Failed to process WebSocket message:', error);
        //     }
        // }
        // };
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
        <>
            <div className="flex flex-row h-screen w-screen">

                <div className="flex flex-col w-1/4 bg-[#150f77]">

                    <div className="flex h-1/6 ">

                    </div>

                    { isConnected ? (
                        <div className="flex flex-col h-5/6 bg-gradient-to-b from-[#150f77] via-[#191392] to-[#9e28ec]">
                        {client_list?.map((names, index) => (
                            <div key={index} className="flex items-center h-11 mx-2 my-[1px] bg-gradient-to-br bg-[#5b54d4] px-4 shadow-md border-separate hover:cursor-pointer hover:from-[#150f77] hover:via-[#191392e7] hover:to-[#9d28ece0] hover:bg-[#554ed4] -skew-x-3">
                                {names === data ? (
                                    <div className="flex flex-row w-full justify-between ">
                                        <div className="flex w-2/3">
                                            <h5 className="text-white text-left">{names} 🟢 </h5>
                                        </div>
                                        <div className="flex w-1/3 justify-end">
                                            <h5 className="flex text-white text-right">{preferred_language}</h5>
                                        </div>
                                        
                                    </div>
                                    
                                ) : (
                                    <h5 className="text-white">{names}</h5>
                                ) 
                                }
                                
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="flex flex-col h-5/6 bg-[#150f77]">
                        {name_list?.map((names, index) => (
                            <div key={index} className="flex items-center h-11 mx-2 my-[1px] bg-[#5b54d4] px-4 shadow-md border-separate hover:cursor-pointer hover:bg-[#554ed4] -skew-x-3">
                                <button>
                                    <h5 className="text-white">{names}</h5>
                                </button>
                               
                            </div>
                        ))}
                        </div>
                    )
                    
                    }
                </div>

                <div className="flex flex-col w-3/4">

                    <div className="flex h-1/6 bg-gradient-to-b from-[#150f77] via-[#191392] to-[#9e28ec] justify-center items-center">
                        <p className="text-center font-bold font-mono text-[#b375fa]">{roomID}</p>
                    </div>
                    { isConnected ? (
                    <div className="flex flex-col justify-between h-5/6 bg-[#d2d3dd]">

                        <div className="flex flex-col overflow-y-auto items-start justify-start">
                        {Chat.map((name, index) => (
                            <div key={index} className="flex flex-grow flex-col w-full flex-wrap px-4 py-1">
                                {Object.entries(name).map(([key, value]) => (
                                    <div key={key}>
                                        {key === username ? (
                                            <div className="flex justify-start">
                                            <div className="w-fit max-w-3xl border border-blue-200 rounded-md px-4 bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
                                                <div className="text-xs pt-1 font-bold text-[#46197a]">You
                                                    
                                                </div>
                                                <p>
                                                    {value.toString()}
                                                </p>
                                            </div>
                                        </div>
                                            
                                        ):(
                                            // <div className="flex justify-start">
                                            //     <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4  bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
                                            //         <div className="text-xs pt-1 font-bold text-[#46197a]">
                                            //             {key}
                                            //         </div>
                                            //         {value.toString()}
                                            //     </p>
                                            // </div>
                                            <div className="flex justify-start">
                                                <div className="w-fit max-w-3xl border border-blue-200 rounded-md px-4 bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
                                                    <div className="text-xs pt-1 font-bold text-[#46197a]">
                                                        {key}
                                                    </div>
                                                    <p>
                                                        {value.toString()}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                        )}
                                        
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div ref={chatEndRef} /> {/* Auto-scroll target */}
                        </div>

                        <div className="flex flex-row justify-start min-h-14 border border-gray-400 items-center bg-[#23004b]">
                            <input 
                                className="w-5/6 mx-4 h-8 shadow-xl rounded-full px-4"
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
                    ):(
                        <div className="flex flex-col w-full p-4">
                             <div className="flex flex-col w-full my-4">
                                <label>Create OR Join a ROOM with an ID</label>
                                <input 
                                className="border-2"
                                    type="text" 
                                    value={roomID}
                                    onChange={(event) => setRoomID(event.target.value)}
                                    />
                             </div>
                             <div>
                                <button onClick={create_connection} className="bg-[#f12121] px-4 rounded-md text-white py-2 hover:bg-[#bd2727]">
                                    Submit
                                </button>
                             </div>
                        </div>
                    )}

                </div>

            </div>
        </>

        // <div className="flex flex-col h-screen w-screen bg-slate-200">

        //    <div className="flex h-1/6 min-h-20 bg-gradient-to-b from-[#23004b] via-[#470592] to-[#6a0ad6] items-center justify-center">
        //         <h1 className="text-white font-bold text-2xl font-mono text-center justify-center items-center">MultiLinguo</h1>
        //    </div>


        //    <div className="flex flex-row flex-grow h-5/6">

        //         <div className="w-1/4 bg-white">
        //             {client_list?.map((names, index) => (
        //                 <div key={index} className="flex items-center h-11 px-4 shadow-md border-separate border bg-gray-100">
        //                     <h5 className="text-gray-600">{names}</h5>
        //                 </div>
        //             ))}
        //         </div>

        //         <div className="flex flex-grow justify-between flex-col bg-gradient-to-b from-[#e0d2f0] to-white min-h">
                    
        //             <div className="flex h-10 shadow-xl mb-4 bg-white w-full justify-center items-center">
        //                 <p className="text-center font-bold font-mono text-[#2c0f4e]">{roomID}</p>
        //             </div>
                   
        //             <div className="flex flex-col overflow-y-auto items-start justify-start">
        //                 {Chat.map((name, index) => (
        //                     <div key={index} className="flex flex-grow flex-col w-full flex-wrap px-4 py-1">
        //                         {Object.entries(name).map(([key, value]) => (
        //                             <div key={key}>
        //                                 {key === username ? (
        //                                     <div className="flex justify-end">
        //                                         <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4  bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
        //                                             <div className="text-xs pt-1 font-bold text-[#46197a]">
        //                                                 You
        //                                             </div>
        //                                             {value.toString()}
        //                                         </p>
        //                                     </div>
                                            
        //                                 ):(
        //                                     <div className="flex justify-start">
        //                                         <p className="w-fit max-w-3xl border border-blue-200 rounded-md px-4  bg-gradient-to-b from-gray-400 to-gray-200 shadow-lg my-1">
        //                                             <div className="text-xs pt-1 font-bold text-[#46197a]">
        //                                                 {key}
        //                                             </div>
        //                                             {value.toString()}
        //                                         </p>
        //                                     </div>
                                            
        //                                 )}
                                        
        //                             </div>
        //                         ))}
        //                     </div>
        //                 ))}
        //                 <div ref={chatEndRef} /> {/* Auto-scroll target */}
        //             </div>
                    

        //             <div className="flex flex-row justify-start min-h-14 border border-gray-400 items-center bg-[#23004b]">
        //                 <input 
        //                     className="w-5/6 mx-4 h-8 shadow-xl rounded-full px-4"
        //                     type="text"  
        //                     value={newText}
        //                     onChange={(event) => setNewText(event.target.value)}
        //                     onKeyDown={(e) => {
        //                         if (e.key === "Enter") {
        //                           handleSend(e)
        //                         }
        //                     }}
        //                     />
        //                 <button 
        //                     className="flex bg-blue-700 p-1 px-2 rounded-md text-white font-mono"
        //                     onClick = {handleSend}
        //                     >
        //                     Send
        //                 </button>
        //             </div>
                    
                    
        //         </div>
        //    </div>
        // </div>
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