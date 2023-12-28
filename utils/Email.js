const nodemailer = require("nodemailer")
require("dotenv").config()


// Send Email when a new user create an account===================>
function sendEmail(newUser) {

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_DETAILS,
            pass: process.env.PASS
        }
    })

    const mailingDetails = {
        from: process.env.USER_DETAILS,
        to: newUser.email,
        subject: newUser.subject,
        text: newUser.message
    }

    mailTransporter.sendMail(mailingDetails, function (err, data) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("mail send successfully")
        }
    })
}


// Send OTP incase user forget the password=================================>
function sendOTP(generatedOtp, email) {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_DETAILS,
            pass: process.env.PASS
        }
    })

    const mailingDetails = {
        from: process.env.USER_DETAILS,
        to: email,
        subject: "OTP confimation Code",
        text: `Your generated OTP is ${generatedOtp}`
    }

    mailTransporter.sendMail(mailingDetails, function (err, data) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("Mail send successfully")
        }
    })
}


//Send Email when user fill the contact form===============================>
function sendEmailContact(newUser) {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_DETAILS,
            pass: process.env.PASS
        }
    })

    const mailingDetails = {
        from: process.env.USER_DETAILS,
        to: newUser.email,
        subject: "User details",
        text: `Thank you for contacting us, We will get back to you shortly!",
        Name : ${newUser.name}
        Email : ${newUser.email}
        Phone No: ${newUser.phone}
        Textarea : ${newUser.textarea}`
    }

    mailTransporter.sendMail(mailingDetails, function (err, data) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("Mail send successfully")
        }
    })
}

module.exports = { sendEmail, sendOTP, sendEmailContact }




