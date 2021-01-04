const jwt = require("jsonwebtoken");
const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");
const router = require("./routes/index");

const path = require("path");
const PORT = process.env.PORT || 3001;
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();

const server = require("http").createServer(app);
const uri = process.env.MONGODB_URI;

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(require("cors")());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);
app.use("/api/chat", require("./routes/chat"));

const { Chat } = require("./models/Chat");

const connect = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to the Database.");
});
mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection Error : " + err);
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const io = require("socket.io")(server, {
  cors: {
    origin: "/",
    methods: ["GET", "POST"],
  },
});
// server.listen(3001)
io.on("connection", (socket) => {
  socket.on("Input Chat Message", (msg) => {
    connect.then((db) => {
      try {
        let chat = new Chat({
          message: msg.chatMessage,
          sender: msg.userId,
          type: msg.type,
        }); //FILL_ME
        chat.save((err, doc) => {
          if (err) return console.log("error ");

          Chat.find({ _id: doc._id })
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output Chat Message", doc);
            });
        });
      } catch (error) {
        console.error(error);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
global.authenticateToken = function (req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};

const addUserRouter = require("./routes/route.js");
app.use("/api", addUserRouter);
