"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Puppeteer = require("puppeteer");
class WebScraping {
    constructor(useragent) {
        this.useragent = useragent;
    }
    start(option) {
        if (this.browser) {
            return Promise.resolve(this.browser);
        }
        return Puppeteer.launch(option).then((browser) => {
            this.browser = browser;
            return browser;
        });
    }
    page(useragent) {
        return this.start().then(() => {
            return this.browser.newPage();
        }).then((page) => {
            if (typeof useragent !== 'string') {
                useragent = this.useragent;
            }
            if (useragent) {
                page.setUserAgent(useragent);
            }
            return page;
        });
    }
    fetch(url, option) {
        return this.page().then((page) => {
            return page.goto(url, option).then((response) => {
                page.close();
                return response;
            });
        });
    }
    waitDomContentLoaded(page) {
        return page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }
    wait(msec) {
        return new Promise((resolve) => {
            setTimeout(() => { resolve(); }, msec);
        });
    }
    end() {
        if (!this.browser) {
            return Promise.resolve();
        }
        const browser = this.browser;
        this.browser = null;
        return browser.close();
    }
}
exports.default = WebScraping;
