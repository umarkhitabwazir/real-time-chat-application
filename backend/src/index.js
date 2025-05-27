import { app } from "./app.js"
import dotenv from "dotenv"
import { dbConnect } from "./db/db.js"
import { ApiError } from "./utils/api-error.js"
import { createServer } from "http"
import {Server} from "socket.io"
import cors from "cors"

dotenv.config({
    path:".env"
})
const port=process.env.PORT
const httpServer = createServer(app)
const io=new Server(httpServer,cors({
    origin: process.env.origin,
    credentials: true,
}));   

io.on("connection", (socket) => {
  
  socket.on("message", (message) => {
    console.log("Received message from frontend:", message);
    io.emit("backend-message", message);
     socket.broadcast.emit('message', message);
  })
  socket.on('typing', (data) => {
    console.log("User is typing:", data);
    socket.broadcast.emit('typing', data);
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


dbConnect().then(()=>{

httpServer.listen(port,()=>{
    console.log(`app listing on ${port}`)
})
}
).catch((error)=>{
    console.log("DB connection failed:",error)
    throw new ApiError(501,"DB connection failed")
})
