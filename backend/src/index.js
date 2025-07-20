import { app } from "./app.js"
import dotenv from "dotenv"
import { dbConnect } from "./db/db.js"
import { ApiError } from "./utils/api-error.js"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

dotenv.config({
  path: ".env"
})
const onlineUsers = new Map(); // Use a single Map instance
const port = process.env.PORT
const httpServer = createServer(app)
const io = new Server(httpServer, cors({
  origin: process.env.origin,
  credentials: true,
}));

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    const cleanUsername = username.split("_")[0]
    socket.username = cleanUsername;
    console.log("Socket connected:", socket.username);

    onlineUsers.set(cleanUsername, socket.id);


    socket.join(username); // Join room with username
    if (onlineUsers.size > 0) {
      console.log("onlineUsers",);

      io.emit("userStatus", {
        onlineUsers: Array.from(onlineUsers.keys()),
      
      })
    }




    console.log(` ${cleanUsername} joined their personal room`);

  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.username);
    io.emit("userDisconnected", {
      onlineUsers: Array.from(onlineUsers.keys()),
     
    });
    console.log("❌ Socket disconnected");
  });

  socket.on("message", (message) => {
    console.log("Received message from frontend:", message);

    io.emit("backend-message", message);
    socket.emit('message', message);

    io.to(message.sender.username).emit("updateParticipants", {
      sender: message.sender.username,
      receiver: message.receiver.username
    });

    io.to(message.receiver.username).emit("updateParticipants", {
      sender: message.sender.username,
      receiver: message.receiver.username
    });
  });
  socket.on('typing', (data) => {
    console.log("User is typing:", data);
    io.to(data.room).emit('userTyping', { sender: data.sender, receiver: data.receiver });

  });


});


app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Chat API</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to the real time chat API!</h1>
      </body>
    </html>
  `);
});


dbConnect().then(() => {

  httpServer.listen(port, () => {
    console.log(`app listing on ${port}`)
  })
}
).catch((error) => {
  console.log("DB connection failed:", error)
  throw new ApiError(501, "DB connection failed")
})
