const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const AuthModel = require('./model/AuthModel')

const app = express();
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())

mongoose.connect("mongodb+srv://mijiwim751:aZ8uW2FwMzXKBj3C@cluster0.moybr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connection.on('connected', () => {
    console.log("DB connected")
})

app.listen(3001, () => {
    console.log("server is running")
})

app.post('/register', (req, res) => {
    const { username, fullname, email, password, number } = req.body
    bcrypt.hash(password, 10)
        .then(hash => {
            AuthModel.create({ username, fullname, email, password : hash, number  })
                .then(data => res.json({ data }))
                .catch(err => console.log(err))
        }).catch(err => console.log(err.message))
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    AuthModel.findOne({ username: username })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1d" })
                        res.cookie("token", token)
                        res.json("Success")
                    }
                    else {
                        res.json("incorrect pass")
                    }
                })
            }
            else {
                res.json("no such user")
            }
        })
})

app.post('/forgotpass', (req, res) => {
    //console.log("here")
    const { email } = req.body;
    AuthModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                //console.log("here2")
                return res.send({ Status: "User not existed" })
            }
            const token = jwt.sign({ user: user._id }, "secret", { expiresIn: "1d" })
            console.log(token)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'maverickmindset.yt.official@gmail.com',
                    pass: 'gdoahnoajxxqpees'
                }
            });

            var mailOptions = {
                from: 'maverickmindset.yt.official@gmail.com',
                to: `${user.email}`,
                subject: 'Reset Password',
                text: `http://localhost:3000/reset-password/${user._id}/${token} is your reset link`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    return res.send({Status: "Success"});
                }
            });
        })
})

app.post('/resetpass/:id/:token', (req, res) => {
    const {id,token} = req.params
    const {newPassword} = req.body
    jwt.verify(token, "secret", (err,decode) => {
        if(err){
            //console.log("here2")
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(newPassword, 10)
            .then(hash => {
                AuthModel.findByIdAndUpdate({_id: id}, {password: hash})
                .then(updated => {res.send({Status: "Success"})})
                .catch(err => {res.send({status: err})})
            })
            .catch(err => {res.send({Status: err})})
        }
    })
})

app.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(403).json({ message: "Token not available" });
    }
    else {
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }
            req.user = decoded
            next();
        })
    }
}
//put what u want to protect
// app.get('/home', verifyUser, (req, res) => {
//     return res.json("Success")
// })


//put in the react comp og what u want protected
// axios.defaults.withCredentials = true
//     useEffect(() => {
//         axios.get('http://localhost:3001/home')
//             .then(result => {
//                 console.log(result)
//                 if (result.data !== "Success") {
//                     navigate('/login')
//                 }
//             })
//             .catch(err => {
//                 console.log(err)
//                 navigate('/login')
//             })
//     }, [])