"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Imports_1 = require("./Imports");
class Notifications extends Imports_1.default {
    constructor(options) {
        super();
        this.status = {};
        this.options = options;
    }
    init() {
        return this.load('notifications');
    }
    list(types) {
        const list = [];
        for (let type of types) {
            if (type === 'all') {
                return Object.keys(this.mods);
            }
            if (list.includes(type) || !this.mods[type]) {
                continue;
            }
            list.push(type);
        }
        return list;
    }
    notify(module, data, types = 'all') {
        if (this.status[module] === undefined) {
            this.status[module] = false;
        }
        if (data.send === this.status[module]) {
            return Promise.resolve('No send: ' + data.message);
        }
        this.status[module] = data.send;
        types = this.list(typeof types === 'string' ? [types] : types);
        return Promise.all(types.map((type) => {
            return this.mods[type](data, this.options[type]).then((result) => {
                return { message: result.message, type: type };
            });
        })).then((result) => {
            console.log(result);
            return '';
        });
    }
}
exports.default = Notifications;
