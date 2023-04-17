const bcrypt = require('bcrypt');

async function hash(value) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);
    
    return hash;
}

async function isMatch(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch
}

module.exports = {
    hash,
    isMatch
};