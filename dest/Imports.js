"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class Modules {
    constructor() {
        this.mods = {};
    }
    load(dir) {
        const basedir = path.join(__dirname, dir);
        return fs.promises.readdir(basedir).then((files) => {
            return files.filter((file) => {
                if (!file.match('^[^\.].+\.js$')) {
                    return false;
                }
                const stat = fs.statSync(path.join(basedir, file));
                if (!stat) {
                    return false;
                }
                return stat.isFile();
            });
        }).then((files) => {
            return Promise.all(files.map((file) => {
                return Promise.resolve().then(() => require(path.join(basedir, file))).then((mond) => {
                    if (typeof mond.default !== 'function') {
                        console.warn('Load failure:', file);
                        return;
                    }
                    const modname = file.replace(/\.js$/, '');
                    console.debug('Loaded[' + dir + ']:', modname);
                    this.mods[modname] = mond.default;
                });
            }));
        });
    }
}
exports.default = Modules;
