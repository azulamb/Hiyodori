"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Daemon {
    constructor(config) {
        this.config = config.daemon;
        this.events = { update: [] };
    }
    start() {
        if (this.timer) {
            this.stop();
        }
        const interval = (0 < this.config.interval ? this.config.interval : 10) * 60000;
        this.timer = setInterval(() => { this.update(); }, interval);
        return new Promise((resolve) => { this.resolve = resolve; });
    }
    stop() {
        if (!this.timer) {
            return;
        }
        clearInterval(this.timer);
        this.timer = null;
        if (this.resolve) {
            this.resolve();
        }
        this.resolve = null;
    }
    update() {
        this.events.update.forEach((callback) => { callback(); });
    }
    addEventListener(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
}
exports.default = Daemon;
