const { Socket } = require('dgram');
const express = require("express");

const peer = require("peer");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

// Set static folder
app.use(express.static(path.join(__dirname, "/public")));
app.use("/peer", peer.ExpressPeerServer(app, { proxied: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect(`/signup.html`);
});
app.get("/newmeet", (req, res) => {
    const link = uuidV4()
    res.redirect(`/${link}`);
});

app.get("/:room", (req, res) => {
    res.render("room", { roomID: req.params.room });
});

// Run when user connects
io.on("connection", (socket) => {
    socket.on("join-room", (roomID, userID,Name) => {
        socket.join(roomID);

        // Broadcast when a user connects 
        socket.broadcast.to(roomID).emit("user-connected", userID,Name);
        
        socket.on('message', message => {
        //send chat messages to all the users in the same room through chat-box
            io.to(roomID).emit('createMessage', message,Name)
        });

        socket.on('raise-hand', () => {
         //send hand raise message to all the users in the same room through chat-box
            io.to(roomID).emit('raiseHand', Name)
        }); 
        
        // Runs when user disconnects
        socket.on("disconnect", () => {
            // Broadcast when a user disconnects
            socket.broadcast.to(roomID).emit("user-disconnected", userID,Name);
        });

    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT);