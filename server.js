
const express = require('express')
const cors = require('cors')
const path = require('path');
const nodemailer = require('nodemailer')

const mongoose = require('mongoose')
const app = express();

mongoose.connect('mongodb://127.0.0.1/userInfo')
    .then(() => console.log("Db Connected")).catch(err => console.log("error", err))

app.use(cors());
// app.use(express.json());

const multer = require('multer');  // used for storing image 
const upload = multer({ dest: 'uploads/' });
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
    imageUrl: String,
    updated: { type: Date, default: Date.now() }
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
    const imgUrl = req?.file?.path || ''


    const userDataObj = new UserDetails({
        name: name,
        email: email,
        companyName: companyName,
        linkedinUrl: url,
        batchYear: batchYear,
        imageUrl: imgUrl,
        updated: Date.now()
    })

    const dataRes = await userDataObj.save();

    if (dataRes) {
        res.json({ message: 'success' })
        return
    }
})

app.post('/editUserInfo', upload.single('image'), async (req, res) => {

    const { email, companyName, url, name, batchYear } = req.body;

    console.log('emailTest:', email);
    console.log('Image:', req.file || '');
    console.log('companyName', companyName || '')
    console.log("url", url || '')
    console.log('name', name || '')
    console.log('batchYear', batchYear || 2020)


    const result = await UserDetails.findOne({ email: email });
    console.log("updated", result)
    let imgPath = ''

    if (req.file && req.file.path) {
        imgPath = req.file.path;
    }
    result.name = name || result.name;
    result.companyName = companyName || result.companyName;
    result.imageUrl = imgPath || result.imageUrl;
    result.linkedinUrl = url || result.linkedinUrl;
    result.batchYear = batchYear || result.batchYear;
    // 6th field is email but user can't change their email 

    const ans = await result.save();

    console.log("ans128", ans)

    let arr = []
    arr.push(ans)

    res.json({ data: arr, message: 'success updated' })
    console.log("result122", result)
})

app.get('/getPrivateData', async (req, res) => {

    UserDetails.find({}, function (err, datas) {

        if (err) {
            console.log("error", err)
        }
        else {
           
            console.log("data12",datas)

             res.json({data:datas,message:'successfully hit'})

        }
    })
})

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});