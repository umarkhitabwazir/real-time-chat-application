import { Socket } from "socket.io-client";
import { Message } from "../interfaces/message.interface";
import io from 'socket.io-client';
import { User } from "../interfaces/user.interface";
import { Dispatch, SetStateAction } from "react";



export let appSocket: typeof Socket = null!;


export const initiateSocket = (url: string) => {
    appSocket = io(url, {
        transports: ["websocket"],

    });
    appSocket.on("connect", () => {
        console.log("login Usernamme", document.cookie)
        console.log("✅ Socket connected:", appSocket.id);

     
    });

   

    appSocket.on("connect_error", (err: Error) => {
        console.error("❌ Socket connection error:", err);
    });
};

export const subscribeToMessages = (cb: (msg: Message) => void) => {
    if (!appSocket) return;


    appSocket.on('backend-message', cb);
};

export const sendMessage = (message: Message) => {
    if (appSocket) appSocket.emit('message', message);
};
export const emitTypingEvent = (roomId: string, username: string, selectedUser: string) => {
    if (!appSocket || !username || !selectedUser) return;
    appSocket.emit("join", roomId);

    appSocket.emit('typing', {
        room: roomId,
        sender: username,
        receiver: selectedUser,
    });



}

export const listenForTyping = (user: User, setTyping: Dispatch<SetStateAction<string | null>>) => {
    if (appSocket && user.user?.username) {
        console.log("listenForTyping called with user:", user.user?.username);
        appSocket.on('userTyping', ({ sender, receiver }: { sender: string; receiver: string }) => {
            console.log("user typing")
            console.log("Typing event received:", sender, receiver || "No data");
            if (receiver === user.user?.username) {
                setTyping(`typing...`);
            }
        })
    }

}