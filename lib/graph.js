'use strict';


const Mod = require('./mod');

class Graph {

    constructor() {
        this._mods = {};
    }

    register(orgMod) {
        if (this._mods.hasOwnProperty(orgMod.name)) {
            throw new Error('initgraph: module ' + orgMod.name + ' already exists');
        }

        this._root = new Mod();
        const mod = new Mod(orgMod);
        this._mods[mod.name] = mod;
    }

    initialize(cb) {
        this._resolveDependencies();
        return this._root.initialize().nodeify(cb);
    }

    uninitialize(cb) {
        return this._root.uninitialize().nodeify(cb);
    }

    _resolveDependencies() {
        Object.keys(this._mods).forEach((modName) => {
            const mod = this._mods[modName];
            if (mod.dependencies.length === 0) {
                mod.dependsOn(this._root);
                return;
            }

            mod.dependencies.forEach((depName) => {
                mod.dependsOn(this._mods[depName]);
            });
        });
    }
}

module.exports = Graph;

