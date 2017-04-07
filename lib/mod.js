'use strict';

const Promise = require('bluebird');
const assert = require('assert');

const State = {
    CLOSED:     0,
    INITING:    1,
    READY:      2,
    UNINITING:  3,
};

class Mod {

    constructor(mod) {
        this._mod = mod || { name: 'root' };
        this._parents = [];
        this._dependents = [];
        this._pending = [];
        this._state = State.CLOSED;
        this._initialized = false;

        if (this._mod.init) {
            switch (this._mod.init.length) {
                case 0:
                    this._init = function () {
                        return this._mod.init();
                    };
                    break;
                case 1:
                    this._init = Promise.promisify(this._mod.init, this._mod);
                    break;
                default:
                    throw new Error('initgraph: ' + this._mod.name + ' has init() with more than one argument');
            }
        } else {
            this._init = function () { return Promise.resolve(); };
        }

        if (this._mod.uninit) {
            switch (this._mod.uninit.length) {
                case 0:
                    this._uninit = function () {
                        return this._mod.uninit();
                    };
                    break;
                case 1:
                    this._uninit = Promise.promisify(this._mod.uninit, this._mod);
                    break;
                default:
                    throw new Error('initgraph: ' + this._mod.name + ' has uninit() with more than one argument');
            }
        } else {
            this._uninit = function () { return Promise.resolve(); };
        }


        Object.defineProperty(this, 'name', {
            get: function () {
                return this._mod.name;
            }
        });
        Object.defineProperty(this, 'dependencies', {
            get: function () {
                return this._mod.dependencies || [];
            }
        });
        Object.defineProperty(this, 'initialized', {
            get: function () {
                return (this._state === State.READY);
            }
        });
        Object.defineProperty(this, 'uninitialized', {
            get: function () {
                return (this._state === State.CLOSED);
            }
        });
    }


    dependsOn(mod) {
        mod._dependents.push(this);
        this._parents.push(mod);
    }

    initialize() {
        if (this._state === State.READY) {
            return new Promise.resolve(); // nothing to do
        }

        if (this._state === State.UNINITING) {
            return new Promise.reject(new Error('Not allowed'));
        }

        if (this._state === State.INITING) {
            return new Promise((resolve, reject) => {
                this._pending.push({
                    resolve: resolve,
                    reject: reject
                });
            });
        }

        assert.equal(this._state, State.CLOSED, this.name);
        this._state = State.INITING;

        return this._init()
        .catch((err) => {
            this._state = State.CLOSED;
            throw new Error('Failed to initialize ' + this.name + ': ' + err.message);
        })
        .then(() => {
            const promises = this._dependents.map((dep) => {
                return dep.initialize();
            });
            return Promise.all(promises)
            .then(() => {
                this._state = State.READY;
                this._resolvePending();
            }, (err) => {
                this._state = State.CLOSED;
                this._resolvePending(err);
            });
        });
    }

    uninitialize() {
        if (this._state === State.CLOSED) {
            return new Promise.resolve(); // nothing to do
        }

        if (this._state === State.INITING) {
            return new Promise.reject(new Error('Not allowed'));
        }

        if (this._state === State.UNINITING) {
            return new Promise((resolve, reject) => {
                this._pending.push({
                    resolve: resolve,
                    reject: reject
                });
            });
        }

        assert.equal(this._state, State.READY, this.name);
        this._state = State.UNINITING;

        // unitinialize dependents first
        const promises = this._dependents.map((dep) => {
            return dep.uninitialize();
        });
        return Promise.all(promises)
        .catch((err) => {
            console.log('%s: failed to uninitialize dependents: err=%j', this.name, err);
            // swallow the error and move on
        })
        .then(() => {
            return this._uninit()
            .catch((err) => {
                console.log('%s: failed to initialize itself: err=%j', this.name, err);
                // swallow the error and move on
            })
            .then(() => {
                this._state = State.CLOSED;
                this._resolvePending();
            });
        });
    }

    _resolvePending(err) {
        this._pending.forEach((deferred) => {
            if (err) {
                return deferred.reject(err);
            }
            return deferred.resolve();
        });
    }
}

module.exports = Mod;

