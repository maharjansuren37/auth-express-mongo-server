const mongooe = require("mongoose");
require('dotenv').config();

const password = encodeURIComponent(process.env.MONGO_PW);

async function dbConnect() {
    mongooe.connect(
        `mongodb+srv://goodweather37:${password}@auth-mern.rjdo8zo.mongodb.net/?retryWrites=true&w=majority&appName=auth-MERN`,
        {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
            //useCreateIndex: true,
        }
    ).then(() => {
        console.log("Successfully connected to MongoDB!")
    }).catch((error) => {
        console.log("Unable to connect MongoDB!");
        console.log(error);
    })
} 

module.exports = dbConnect;