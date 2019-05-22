"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
function Web(data, option) {
    console.log('Android:', data);
    const app = admin.initializeApp({
        credential: admin.credential.cert(option.credential),
        databaseURL: option.databaseURL,
    });
    const tokens = option.tokens || [];
    const message = {
        data: { title: 'TITLE', body: 'MESSAGE' },
        tokens: tokens,
    };
    return admin.messaging().sendMulticast(message).then((response) => {
        console.log(response);
        if (0 < response.failureCount) {
            console.error('Failure tokens:');
            response.responses.forEach((res, index) => {
                if (res.success) {
                    return;
                }
                console.error('[' + index + ']: ' + tokens[index]);
            });
        }
        return app.delete();
    }).then(() => {
        return { message: 'OK' };
    });
}
exports.default = Web;
