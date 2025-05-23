import { app } from "./app.js"
import dotenv from "dotenv"
import { dbConnect } from "./db/db.js"
import { ApiError } from "./utils/api-error.js"

dotenv.config({
    path:".env"
})
const port=process.env.PORT


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

app.listen(port,()=>{
    console.log(`app listing on ${port}`)
})
}
).catch((error)=>{
    console.log("DB connection failed:",error)
    throw new ApiError(501,"DB connection failed")
})
