const axios = require('axios');
const nodemailer = require('nodemailer');
const fs = require('fs')

require('dotenv').config();

const websiteUrl = 'https://rockfieldmd.com/ifuvideo/';
const checkInterval = 60 * 60 * 1000; // 1 hour 

// Schedule the website check
setInterval(() => {
  checkWebsite(websiteUrl);
}, checkInterval);

async function checkWebsite(url) {

    try {
        const response = await axios.get(url);
        // Website is live
        console.log(`Website is live: ${url}`);
        // Log the result to a file

        writeLog("Website is live");

    } catch (error) {
        // Website is down
        console.error(`Website is down: ${url}`);
        // Log the error to a file
        // You can use the fs module to append the error to a file

        writeLog(error);

        // Send email notification
        sendEmailNotification(error);
    }
}

function sendEmailNotification(error) {

    const receipient = "gaughraneoin@yahoo.ie";

    // Create a transporter with your email configuration
    const transporter = nodemailer.createTransport({

        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SENDINBLUE_USER, // generated ethereal user
            pass: process.env.SENDINBLUE_PASS, // generated ethereal password
        },
    });
  
    // Configure the email content
    const mailOptions = {

        from: '"Rockfield Website" <'+process.env.SENDINBLUE_USER+'>',
        to: receipient,
        subject: 'Website Down',
        text: `The website is down with the following error: ${error}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {

        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function writeLog(contentToWrite){

    const currentTime = new Date().toLocaleTimeString();

    fs.appendFile('log.txt', "\n"+currentTime+"-: "+contentToWrite, 'utf8', (err) => {

        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('File written successfully!');
        }
    });
}