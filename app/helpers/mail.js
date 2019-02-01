const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '187f0e84009b2c', // generated ethereal user
        pass: 'e4669ef0eed5d2' // generated ethereal password
    }
});

module.exports = transporter;