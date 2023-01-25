
const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')
const app = express();

mongoose.connect('mongodb://127.0.0.1/userInfo')
    .then(() => console.log("connected")).catch(err => console.log("error", err))

app.use(cors());
app.use(express.json());

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
    companyName:String
    // profilePhoto:
})

const UserDetails = mongoose.model('userDetails', studentInfo)

app.post('/addUserInfo', async (req, res) => {

    const { data } = req.body

    console.log("data37",data)

    const userDataObj = new UserDetails({
           name:data.name,
           email:data.email,
           companyName:data.companyName,
           linkedinUrl:data.url,
           batchYear:data.batchYear
    })

    const dataRes = await userDataObj.save();

    console.log("empRes38", dataRes)
    res.json({ message: "success ...." })

    // console.log("data29", data)
})

// app.post('/search', async (req, res) => {

//     const { phoneNumber } = req.body;

//     console.log("Number46", phoneNumber)

//     const searchData = await EmployeeSchema.find({ phoneNumber: phoneNumber })

//     console.log("searchData46", searchData)

//     res.json({ data: searchData, message: "successfully API hit " })
// })

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});