"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
function Web(data, option) {
    console.log('Android:', data);
    admin.initializeApp(option.credential);
    const tokens = option.tokens || [];
    const message = {
        data: { title: 'TITLE', body: 'MESSAGE' },
        tokens: tokens,
    };
    return admin.messaging().sendMulticast(message).then((response) => {
        if (0 < response.failureCount) {
            console.error('Failure tokens:');
            response.responses.forEach((res, index) => {
                console.error('[' + index + ']: ' + tokens[index]);
            });
        }
        return { message: 'OK' };
    });
}
exports.default = Web;
