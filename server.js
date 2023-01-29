
const express = require('express')
const cors = require('cors')
const path = require('path');
const nodemailer = require('nodemailer')

const mongoose = require('mongoose')
const app = express();

mongoose.connect('mongodb://127.0.0.1/userInfo')
    .then(() => console.log("connected")).catch(err => console.log("error", err))

app.use(cors());
// app.use(express.json());




const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// const transporter = nodemailer.createTransport({
//     host: "smtp.example.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "email@example.com",
//         pass: "password"
//     }
// });

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'))

const studentInfo = new mongoose.Schema({
    name: String,
    email: String,
    linkedinUrl: {
        type: String,
        validate: {
            validator: function (value) {
                return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
            },
            message: 'Invalid URL'
        },
    },
    batchYear: Number,
    companyName: String,
    imageUrl: String
})

const UserDetails = mongoose.model('userDetails', studentInfo)

const fs = require('fs');

app.get('/getSingleUser', async (req, res) => {
    UserDetails.find({}, function (err, datas) {
        if (err) {
            console.error(err);
        } else {

            console.log("datas78", datas);
            res.json({ data: datas, message: 'success 200' })
        }
    });

})

app.post('/addUserInfo', upload.single('image'), async (req, res) => {
    const { email, companyName, url, name, batchYear } = req.body;
    console.log('Email:', email);
    console.log('Image:', req.file);
    console.log('companyName', companyName)
    console.log("url", url)
    console.log('name', name)
    console.log('batchYear', batchYear)

    const imgUrl = req.file.path

    if (!imgUrl) {
        res.json({ message: 'bad request' })
    }

    const userDataObj = new UserDetails({
        name: name,
        email: email,
        companyName: companyName,
        linkedinUrl: url,
        batchYear: batchYear,
        imageUrl: imgUrl,
    })

    const dataRes = await userDataObj.save();

    if (dataRes) {

        res.json({ message: 'success' })
    }
    // else
    // {
    //     res.json({err:error})
    // }


})

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});