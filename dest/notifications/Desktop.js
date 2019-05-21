"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notifier = require("node-notifier");
function Windows(data) {
    console.log('Desktop:', data);
    return new Promise((resolve, reject) => {
        notifier.notify({
            title: data.title,
            message: data.message,
        }, (error, a, data) => {
            if (error) {
                return reject(error);
            }
            resolve(data);
        });
    }).then((data) => {
        return { message: 'OK' };
    });
}
exports.default = Windows;
