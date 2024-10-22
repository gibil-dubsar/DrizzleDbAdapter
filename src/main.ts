import crypto from 'crypto';

function generateShortId() {
    return crypto.randomBytes(9).toString('base64').replace(/\W/g, '').substring(0, 12);
}
function test_this(){
    for (let i = 0; i < 10; i++) {

        console.log( generateShortId());
    }
}

test_this();
