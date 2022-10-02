const express = require('express');
const mongoose  = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('mongodb connected');
}).catch(err=> console.log(err));

app.use('/api/users', userRoute);
app.use('/api/pins', pinRoute);


app.listen(8800, () => {
    console.log('backend is running!');
});