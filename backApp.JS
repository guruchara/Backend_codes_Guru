const express = require('express')
const cors = require('cors')
const path = require('path');
const nodemailer = require('nodemailer')
const Parse = require('parse/node')

const app = express();
app.use(cors());

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');  // used for storing image 
const upload = multer({ dest: 'uploads/' });
const imgbbUploader = require("imgbb-uploader");

app.use('/uploads', express.static('uploads'))

const APP_ID = "Op2wMNqtUWcolH5AtQ1dCj7huPnJzCOXJJYjEEqp"
const JAVASCRIPT_ID = "bWluFmLekj82s6d3EFjGwu23U5w5vsWShDxLgqIG"

Parse.initialize(APP_ID, JAVASCRIPT_ID);
Parse.serverURL = 'https://parseapi.back4app.com/'

const Appartment = Parse.Object.extend("data_collection")
const appartment = new Appartment();
const appartmentQuery = new Parse.Query(Appartment)

const port = process.env.PORT || 4000
const fs = require('fs');

app.post('/addStudent', upload.single('image'), async (req, res) => {
    try {

        const { email, companyName, url, name, batchYear } = req.body;

        const imgUrl = req?.file?.path || ''
        console.log("imgUrl", imgUrl)

        let response = {}
        try {
            response = await imgbbUploader("cbd44dd9b4da93cee7cea6b1c15ada92", imgUrl)
        } catch (error) {
            console.log("error", error)
        }

        console.log("response51111", response)

        console.log("====================================")
        console.log("RequestData\n", JSON.parse(JSON.stringify(req.body)))
        console.log("====================================\n")

        const userDataObj = new Appartment({
            name: name,
            email: email,
            companyName: companyName,
            linkedinUrl: url,
            batchYear: parseInt(batchYear),
            imageUrl: response.url || '',
            // updated: Date.parse(Date.now()),
            approve: false,
            reject: false
        })

        const dataRes = await userDataObj.save();
        console.log("dataRes57", dataRes)


        return res.json({ message: "sucess true", res: dataRes })

    } catch (error) {
        console.log('error', error
        );
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});