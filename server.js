const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 6000;
app.get("/",  (req, res)=> {
    console.log("checking")
    res.status(200).json({ message: 'Auth route is working!' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});