
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
    email:String,
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
    updated: { type: Date, default: Date.now() },
    approve: Boolean
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
        updated: Date.now(),
        approve: false,
    })

    const dataRes = await userDataObj.save();

        res.json({ message: 'success' })
        return
    }
})


//  all data which I store in rough


const firstTimeUser = new mongoose.Schema({
    name: String,
    email:String,
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
    updated: { type: Date, default: Date.now() },
    approve: Boolean
})

const firstTImeUserDetails = mongoose.model('firstTImeUserDetails', firstTimeUser)

app.post('/firstTimeUsers', upload.single('image'), async (req, res) => {
    const { email, companyName, url, name, batchYear } = req.body;
    const imgUrl = req?.file?.path || ''

    console.log("113email", email)
    console.log("113comapany", companyName)
    console.log("113", name)


    const firstUserObj = new firstTImeUserDetails({
        name: name,
        email: email,
        companyName: companyName,
        linkedinUrl: url,
        batchYear: batchYear,
        imageUrl: imgUrl,
        updated: Date.now(),
        approve: false,
    })

    const dataRes = await firstUserObj.save();
    console.log("130ddddd", dataRes)
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

    firstTImeUserDetails.find({}, function (err, datas) {

        if (err) {
            console.log("error", err)
        }
        else {
            res.json({ data: datas || [], message: 'successfully hit' })
        }
    })
})

app.post('/editPrivate', async (req, res) => {

    const { approve, reject, email } = req.body;

    if (!email) {
        return
    }

    if (req.body.approve) {
        const check = await firstTImeUserDetails.findOne({ email: email });
        console.log("check202", check)

        if (!check) {
            return
        }

        check.approve=true;
        
        let response = await check.save()
        // console.log("response206", response)

        // distinct and approved data 
        const userDataObj = new UserDetails({
            name: check.name,
            email: check.email,
            companyName: check.companyName,
            linkedinUrl: check.linkedinUrl,
            batchYear: check.batchYear,
            imageUrl: check.imageUrl,
            updated: Date.now(),
            approve: true,
        })

        let resss = await userDataObj.save()
        console.log("resss", resss)

        // const result = await UserDetails.findOne({ email: email });

        // const result = await firstTImeUserDetails.findOne({ email: email });

        // result.approve = req.body.approve || false
        // console.log("resut223",result.approve)
        // const ans = await result.save();
        
    }
    // const result = await UserDetails.findOne({ email: email });
    // result.approve = req.body.approve || false
    // const ans = await result.save();




    UserDetails.find({}, function (err, datas) {

        if (err) {
            console.log("error", err)
        }
        else {
            console.log("privateUpdateData", datas)
            res.json({ data: datas, message: 'successfully Hitted' })
        }
    })
})

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});