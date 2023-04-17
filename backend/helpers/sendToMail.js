require("dotenv").config();

const mailgun = require('mailgun-js');

let mg;

let domen;

function initMailGun() {
    domen = process.env.MAILGUN_DOMEN;
    
    mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMEN
    });
    console.log('mailgun started');
}

async function sendMail(to, subject, text) {
    try {
        await mg.messages.create(domen, 
            {
                from: `UEVENT Support <postmaster@${process.env.MAILGUN_DOMEN}>`,
                to: [to],
                subject,
                text,
                html: `<a href="${text}">Reset Link</a>`
            })
    } catch (error) {
        console.error(error.message);
        throw new Error('Mail service currently unavailable');
    }
}

async function sendEventNotification(to, eventTitle, time) {
    try {
        const data = {
            from: `UEVENT Support <postmaster@${process.env.MAILGUN_DOMEN}>`,
            to: [to],
            subject: `${eventTitle} is starting soon!`,
            html: `<h1> Hi </h1>
            <p> Event ${eventTitle} is startin in ${time}. Don't forget about it! </p>
            <a href="http://${process.env.HOST}:${process.env.CLIENT_PORT}/events/">Event Link</a>
            `
        };
        mg.messages().send(data);
    } catch (error) {
        console.error(error.message);
        throw new Error('Mail service currently unavailable');
    }
}
module.exports = { sendMail, sendEventNotification,initMailGun }