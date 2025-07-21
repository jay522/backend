const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
async function handler(req, res) {
  // 1. Authenticate user first (e.g., check session/cookies)
//   if (!req.session.user) return res.status(401).end();

  // 2. Prepare payload
  const payload = {
  "aud": "jitsi",
  "iss": "chat",
  "iat": Math.floor(Date.now() / 1000),
  "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 24),
  "nbf": Math.floor(Date.now() / 1000),
  "sub": "vpaas-magic-cookie-9db913fc5de24673a503ae7504ee5124",
  "context": {
    "features": {
      "livestreaming": true,
      "file-upload": false,
      "outbound-call": true,
      "sip-outbound-call": false,
      "transcription": true,
    //   "list-visitors": false,
      "recording": true,
      "flip": false
    },
    "user": {
      "hidden-from-recorder": false,
      "moderator": true,
      "name": "jayrajverma7777",
      "id": "google-oauth2|107234845106366791792",
      "avatar": "",
      "email": "jayrajverma7777@gmail.com"
    }
  },
  "room": "*"
};
const privateKeyPath = path.join(__dirname, '../JitsiKey.pk');
var jitsiPrivateKey;
try {
  jitsiPrivateKey = await fs.readFileSync(privateKeyPath, 'utf8');
} catch (error) {
  console.error('Error reading Jitsi private key file:', error);
  // Handle the error appropriately, e.g., exit or throw
  process.exit(1);
}
// 3. Sign with PRIVATE KEY (from JaaS dashboard)
const token = jwt.sign(
  payload,
    jitsiPrivateKey, // Store in environment variables
    { algorithm: 'RS256',header: {
      kid: "vpaas-magic-cookie-9db913fc5de24673a503ae7504ee5124/2f5d65vpaas-magic-cookie-9db913fc5de24673a503ae7504ee5124/12187e"
    } } // Required by Jitsi
  );

  res.status(200).json({ token });
}
module.exports = { handler };
