"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Daemon {
    constructor(config) {
        this.config = config.daemon;
    }
    start() {
        if (this.timer) {
            this.stop();
        }
        this.timer = setInterval(() => { this.update(); }, this.config.interval);
    }
    stop() {
        if (!this.timer) {
            return;
        }
        clearInterval(this.timer);
        this.timer = null;
    }
    update() {
    }
}
exports.default = Daemon;
