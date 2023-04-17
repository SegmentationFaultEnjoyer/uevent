require("dotenv").config();

const { runService } = require('./server');
const { initMailGun } = require('./helpers/sendToMail')

const migrate = require('./assets/migrate');

const { existsSync, mkdirSync } = require('fs')
const { join } = require('path')
const automaticNotificator = require('./helpers/automaticNotificator');
const { exit } = require("process");

const avatar = join(__dirname, 'user_data', 'avatars')
const media = join(__dirname, 'user_data', 'media')

const myArgs = process.argv.slice(2);

async function main() {
    if (myArgs[0] === 'run') {
        if (myArgs[1] === 'service') {
            try {

                if(!Number(process.env.DISABLE_MAILGUN)) {
                    initMailGun()
                    automaticNotificator.start()
                }
                if(!existsSync(avatar)) mkdirSync(avatar, { recursive: true })
                if(!existsSync(media))  mkdirSync(media, { recursive: true })
                
                runService()
            } catch (error) {
                console.error('Error occured:', error.message);
                console.log('Trying to restart...');
                setTimeout(() => {
                    runService()
                }, 5000)
                
            }
        }
    }
    
    if(myArgs[0] === 'migrate') {
        await migrate();
        exit(0)
    }
}

main();