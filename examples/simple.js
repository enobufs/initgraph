'use strict';

const initgraph = require('..').create();
const Promise = require('bluebird');

const modA = {
    name: 'modA',
    init: () => {
        return Promise.resolve().then(() => {
            console.log("modA: init'd");
        });
    },
    uninit: () => {
        return Promise.resolve().then(() => {
            console.log("modA: uninit'd");
        });
    }
};

const modB = {
    name: 'modB',
    init: () => {
        return Promise.resolve().then(() => {
            console.log("modB: init'd");
        });
    },
    uninit: () => {
        return Promise.resolve().then(() => {
            console.log("modB: uninit'd");
        });
    },
    dependencies: [ 'modA' ]
};

const modC = {
    name: 'modC',
    init: () => {
        return Promise.resolve().then(() => {
            console.log("modC: init'd");
        });
    },
    uninit: () => {
        return Promise.resolve().then(() => {
            console.log("modC: uninit'd");
        });
    },
    dependencies: [ 'modA' ]
};

const modD = {
    name: 'modD',
    init: () => {
        return Promise.resolve().then(() => {
            console.log("modD: init'd");
        });
    },
    uninit: () => {
        return Promise.resolve().then(() => {
            console.log("modD: uninit'd");
        });
    },
    dependencies: [ 'modB', 'modC' ]
};

// Register these modules.
initgraph.register(modA);
initgraph.register(modB);
initgraph.register(modC);
initgraph.register(modD);

initgraph.initialize().then(() => {
    console.log('init complete');
    return initgraph.uninitialize();
}).then(() => {
    console.log('uninit complete');
});

