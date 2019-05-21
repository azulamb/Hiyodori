"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function AppleSystemStatus(config, ws) {
    console.log('AppleSystemStatus', config);
    const URL = 'https://www.apple.com/jp/support/systemstatus/';
    const conf = typeof config.args === 'object' ? config.args : { list: [] };
    const page = await ws.page();
    await page.goto(URL);
    await page.waitForSelector('.event-container');
    const list = await page.$$eval('.event-container .event', (list) => {
        return list.map((element) => {
            const [service, status] = element.innerHTML.replace(/\<!\-\-[^\<]*\-\-\>/g, '').replace(/^\<span\>(.*)\<\/span\>$/, '$1').split(/\s*-\s*/);
            return { service: service, status: status.replace(/^.+class\=\"(.+)\".+$/, '$1') };
        });
    });
    if (!Array.isArray(conf.list) || conf.list.length <= 0) {
        conf.list = list.map((item) => { return item.service; });
    }
    const result = {
        send: false,
        title: 'AppleSystemStatus',
        message: '',
    };
    const ok = [];
    const error = [];
    list.filter((item) => {
        return conf.list.includes(item.service);
    }).forEach((item) => {
        (item.status === 'resolved' ? ok : error).push(item);
    });
    result.message =
        [
            'OK(' + ok.length + '): ' + ok.map((item) => { return item.service; }),
            'NG(' + error.length + '): ' + error.map((item) => { return item.service; })
        ].join('\n');
    result.send = 0 < error.length;
    return result;
}
exports.default = AppleSystemStatus;
