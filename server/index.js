const express = require("express")
const app = express()
const http = require("http") // use for socket.io
const cors = require("cors")
const { Server } = require("socket.io")
app.use(cors())

const server = http.createServer(app)
// link to the url where we're running socket.io client front end
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
// listening for events in socket.io server
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id)
  })
})
// server
server.listen(3001, () => {
  console.log("SERVER RUNNING")
})
