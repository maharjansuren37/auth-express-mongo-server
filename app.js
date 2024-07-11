const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const auth = require('./auth/auth');
app.use(express.json());

const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');

dbConnect();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});


app.get('/', (req, res, next) => {
    res.json({ message: "Hello from the server!"});
    next();
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                email: req.body.email,
                password: hashedPassword,
            });

            user
            .save()
            .then((result) => {
                res.status(201).send({
                    message: "User Created Successfully",
                    result,
                });
            })
            .catch((e) => {
                res.status(500).send({
                    message: "Error creating user",
                    e,
                });
            });
        })
        .catch((e) => {
            res.status(500).send({
                message: "Password was not hashed successfully!",
                e
            });
        });
});

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            // compare the password entered and the hashed password found
            bcrypt
                .compare(req.body.password, user.password)
                .then((passwordCheck) => {
                    // check if password matches
                    if (!passwordCheck) {
                        return res.status(400).send({
                            message: "Passwords does not match",
                            error
                        });
                    }

                    // create JWT token
                    const token = jwt.sign(
                        {
                        userId: user._id,
                        userEmail: user.email,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h"}
                    );

                    res.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                    });
                 })
                .catch(e => {
                    res.status(400).send({
                        message: "Password does not match!",
                        e,
                    });
                }) ;
        })
        .catch((e) => {
            res.status(404).send({
                message: "Email not found",
                e
            })
        })
});

app.get('/free-endpoint', (req, res) => {
    res.json({ message: "Free to Access!"});
})

app.get('/auth-endpoint', auth, (req, res) => {
    res.json({ message: "Authorized!"});
})

module.exports = app;