const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const generateRoutes = require("./routes/generateRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const router = express.Router();

const fs = require("fs");
const jwt = require('jsonwebtoken');
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jitsi-token", generateRoutes);
// router.get('/', (req, res) => {
//   // This is just a test route to check if the server is running
//   console.log("checking")
//   res.status(200).json({ message: 'Auth route is working!' });
// });
app.get("/test", function (req, res) {
  console.log("checking");
  res.status(200).json({ message: "Auth route is working!" });
});

const JITSI_APP_ID = process.env.JITSI_APP_ID;
const JITSI_PRIVATE_KEY = process.env.JITSI_PRIVATE_KEY;
const JITSI_KID = process.env.JITSI_KID;

// Define a user object (this would come from your database in a real app)
const defaultUser = {
  id: "guest_user",
  name: "Guest User",
  email: "guest@example.com",
  moderator: true, // You can set this dynamically
};

app.post("/api/generate-token", async (req, res) => {
  const privateKeyPath = path.join(__dirname, "./JitsiKey.pk");
  var jitsiPrivateKey;
  try {
    jitsiPrivateKey = await fs.readFileSync(privateKeyPath, "utf8");
  } catch (error) {
    console.error("Error reading Jitsi private key file:", error);
    // Handle the error appropriately, e.g., exit or throw
    process.exit(1);
  }
  const { roomName,userName,email } = req.body;
console.log(roomName)
  // Set the expiration time for the token (e.g., 1 hour)
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

  // JWT Payload
  const payload = {
    // The "issuer" identifies who issued the JWT.
    // Must match the API key's app ID.
    iss: "chat",

    // The "subject" is the JaaS domain.
    sub: JITSI_APP_ID,

    // The "aud" field is a constant for Jitsi.
    aud: "jitsi",

    // Set the meeting room name
    room: "*",

    context: {
        "features": {
      "livestreaming": true,
    //   "file-upload": false,
      "outbound-call": true,
      "sip-outbound-call": false,
      "premeeting-background": "#e0b7ed",
    },
      "user": {
      "hidden-from-recorder": false,
      "moderator": true,
      "name": "",
      "id": "",
      "avatar": "",
      "email": ""
    }
    },

    // Token expiration time in seconds
    "iat": Math.floor(Date.now() / 1000),
  "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 24),
  "nbf": Math.floor(Date.now() / 1000),
  };

  // JWT Headers
  const header = {
    alg: "RS256", // Algorithm for JaaS keys
    kid: JITSI_KID, // Key ID from your developer account
  };

  try {
    const token = jwt.sign(payload, JITSI_PRIVATE_KEY, {
      algorithm: "RS256",
      header:header,
    });
    res.json({ token });
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).json({ error: "Failed to generate JWT" });
  }
});
// Error handling middleware
app.use(errorHandler);

module.exports = app;
