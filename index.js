const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const dbConnect = require('./db/dbConnect');

dbConnect();

app.get('/', (req, res) => {
    res.send("");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});