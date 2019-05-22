"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Imports_1 = require("./Imports");
class Modules extends Imports_1.default {
    constructor(notifications, ws) {
        super();
        this.notifications = notifications;
        this.ws = ws;
    }
    async init(config) {
        this.debug = !!config.debug;
        await this.notifications.init();
        await this.ws.start(config.puppeteer);
        return this.load('modules');
    }
    execAll(configs = []) {
        return Promise.all(configs.map((config) => {
            return this.exec(config);
        })).then(() => {
        });
    }
    exec(config) {
        console.log('exec:', config, this.mods);
        if (!this.mods[config.module]) {
            return Promise.reject('Notfound: ' + config.name);
        }
        if (config.disable) {
            return Promise.reject('Disable: ' + config.name);
        }
        return this.mods[config.module](config, this.ws).then((result) => {
            console.log(result);
            if (this.debug) {
                result.send = true;
            }
            return this.notifications.notify(config.module, result, config.notification);
        }).catch((error) => {
            console.error(error);
            return 'Error:';
        });
    }
}
exports.default = Modules;
