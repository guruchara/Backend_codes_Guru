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

        console.log("====================================")
        console.log("RequestData\n", JSON.parse(JSON.stringify(req.body)))
        console.log("====================================\n")

        const userDataObj = new Appartment({
            name: name,
            email: email,
            companyName: companyName,
            linkedinUrl: url,
            // batchYear: batchYear,
            imageUrl: imgUrl,
            // updated: Date.now(),
            approve: false,
            reject: false
        })

        const dataRes = await userDataObj.save();
        console.log("dataRes57", dataRes)

        // appartmentQuery.find().then((obj => res.json(obj))).catch((e) => res.json(e))

        return res.json({ message: "sucess true", res: req.body })

    } catch (error) {
        console.log('error', error
        );
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});