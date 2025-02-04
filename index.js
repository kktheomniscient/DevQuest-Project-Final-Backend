const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const AuthModel = require('./model/AuthModel')
const ExpertAuthModel = require('./model/ExpertAuthModel')
const multer = require('multer')
const fs = require("fs");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const {exec} = require('child_process')

ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())

mongoose.connect("mongodb+srv://admin:gunpoint@dqcluster.hlv4t.mongodb.net/?retryWrites=true&w=majority&appName=dqcluster")
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
            AuthModel.create({ username, fullname, email, password: hash, number })
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
                    return res.send({ Status: "Success" });
                }
            });
        })
})

app.post('/resetpass/:id/:token', (req, res) => {
    const { id, token } = req.params
    const { newPassword } = req.body
    jwt.verify(token, "secret", (err, decode) => {
        if (err) {
            //console.log("here2")
            return res.json({ Status: "Error with token" })
        } else {
            bcrypt.hash(newPassword, 10)
                .then(hash => {
                    AuthModel.findByIdAndUpdate({ _id: id }, { password: hash })
                        .then(updated => { res.send({ Status: "Success" }) })
                        .catch(err => { res.send({ status: err }) })
                })
                .catch(err => { res.send({ Status: err }) })
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
app.get('/patient', verifyUser, (req, res) => {
    return res.json("Success")
})
app.get('/profile', verifyUser, (req, res) => {
    return res.json("Success")
})
app.get('/measurement', verifyUser, (req, res) => {
    return res.json("Success")
})
app.get('/taketest', verifyUser, (req, res) => {
    return res.json("Success")
})
app.get('/navbar', verifyUser, (req, res) => {
    return res.json("Success")
})
app.get('/dashboard', verifyUser, (req, res) => {
    return res.json("Success")
})

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

app.post('/ExpertRegister', (req, res) => {
    const { username, fullname, email, password, number } = req.body
    bcrypt.hash(password, 10)
        .then(hash => {
            ExpertAuthModel.create({ username, fullname, email, password: hash, number })
                .then(data => res.json({ data }))
                .catch(err => console.log(err))
        }).catch(err => console.log(err.message))
})

app.post('/ExpertLogin', (req, res) => {
    const { username, password } = req.body;
    ExpertAuthModel.findOne({ username: username })
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

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the 'uploads' directory if it doesn't exist
}

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Files will be saved in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Save the file with a unique name using timestamp to avoid collisions
        cb(null, 'vid.mp4');
    },
});

const upload = multer({ storage: storage });

// Set up POST endpoint for file upload

const getVideoDuration = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                resolve(metadata.format.duration); // Returns duration in seconds
            }
        });
    });
};

const picDir = path.join(__dirname, "pics");
if (!fs.existsSync(picDir)) {
    fs.mkdirSync(picDir, { recursive: true }); // Create the 'uploads' directory if it doesn't exist
}



const extractFrame = (videoPath, duration , picDir) => {
    ffmpeg(videoPath)
        .on('end', () => {
            console.log('Frame extracted successfully!');
        })
        .on('error', (err) => {
            console.error('Error occurred:', err);
        })
        .screenshots({
            count: 1,
            timemarks: [duration/2],  // specify the timestamp in seconds
            filename: 'pic_mid',        // specify the output file name
            folder: './pics',                 // specify the output folder
        });
};

const outputDirectory = path.resolve(__dirname, './frames');
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

const outputPath = path.join(outputDirectory, 'frame_at_middle.jpg');

const clearDirectory = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            console.error(`Directory not found: ${dirPath}`);
            return;
        }

        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.lstatSync(filePath).isFile()) {
                fs.unlinkSync(filePath); // Delete the file
            }
        });

        //console.log(`All files in directory "${dirPath}" have been deleted.`);
    } catch (err) {
        console.error('Error clearing directory:', err);
    }
};

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const videoPath = './uploads/vid.mp4';
    const duration = await getVideoDuration(videoPath);

    try {
        // Extract the frame
        await extractFrame(videoPath, duration, picDir);

        // Execute Python script
        exec('python C:\\Users\\Aspire\\Desktop\\my_code\\devquest_full\\backend\\MLmodelfetching\\api.py', (error, stdout, stderr) => {
            if (error || stderr) {
                console.error("Error executing Python script:", error || stderr);
                return res.status(500).send({
                    message: "Error processing the file.",
                    error: error || stderr,
                });
            }

            // Send success response with the stdout from the Python script
            res.send({
                message: "File processed successfully.",
                pythonOutput: stdout,
                file: req.file,
            });
        });
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).send({
            message: "Error during processing.",
            error: error.message,
        });
    }
});


app.get('/profileInfo', async (req, res) => {
    const token = req.cookies.token;
    let email
    jwt.verify(token, 'secret', (err, decoded) => {
        email = decoded.email
        //console.log(email)
    })
    const user = await AuthModel.findOne({email: email})
    //console.log(user.number)
    return res.json({
        email: user.email,
        fullname: user.fullname,
        mobile: user.number,
        gender : user.gender,
        dob : user.DOB,
        height : user.height,
        weight : user.weight
    })
})

app.get('/getemail', async (req,res) => {
    const token = req.cookies.token;
    let email
    jwt.verify(token, 'secret', (err, decoded) => {
        email = decoded.email
        //console.log(email)
    })
    res.json(`${email}`)
})

app.post('/updatedb', async (req, res) => {
    const { email, mobile, weight, dob, gender, } = req.body;

    try {
        // Find the patient by email (you can use another unique identifier if needed)
        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Update the patient details
        patient.mobile = mobile || patient.mobile;
        patient.weight = weight || patient.weight;
        patient.dob = dob || patient.dob;
        patient.gender = gender || patient.gender;
        patient.height = height || patient.height;

        // Save the updated patient details
        await patient.save();

        return res.status(200).json({ message: 'Patient updated successfully', patient });
    } catch (error) {
        console.error('Error updating patient:', error);
        return res.status(500).json({ message: 'Error updating patient', error });
    }
});