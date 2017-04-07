'use strict';

const initgraph = require('..');
const Promise = require('bluebird');
const debug = require('debug')('initgraph:test');

const DELAY = 0;

describe('tests', function () {
    describe('using Promise', function () {
        let graph;
        let mods;

        beforeEach(function () {
            debug('initgraph');
            graph = initgraph.create();
            mods = [{
                name: 'mod-a',
                init: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-a init'd");
                    });
                },
                uninit: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-a uninit'd");
                    });
                }
            }, {
                name: 'mod-b',
                init: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-b init'd");
                    });
                },
                uninit: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-b uninit'd");
                    });
                },
                dependencies: ['mod-a']
            }, {
                name: 'mod-c',
                init: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-c init'd");
                    });
                },
                uninit: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-c uninit'd");
                    });
                },
                dependencies: ['mod-a']
            }, {
                name: 'mod-d',
                init: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-d init'd");
                    });
                },
                uninit: function () {
                    return Promise.delay(DELAY)
                    .then(function () {
                        debug("mod-d uninit'd");
                    });
                },
                dependencies: ['mod-b', 'mod-c']
            }];
        });

        it('init test', function () {
            mods.forEach(function (mod) {
                graph.register(mod);
            });

            return graph.initialize();
        });

        it('uninit test', function () {
            mods.forEach(function (mod) {
                graph.register(mod);
            });

            return graph.initialize()
            .then(function () {
                return graph.uninitialize();
            });
        });
    });

    describe('callback style', function () {
        let graph;
        let mods;

        beforeEach(function () {
            debug('initgraph');
            graph = initgraph.create();
            mods = [{
                name: 'mod-a',
                init: function (cb) {
                    setTimeout(function () {
                        debug("mod-a init'd");
                        cb();
                    }, DELAY);
                },
                uninit: function (cb) {
                    debug("mod-a uniniting");
                    setTimeout(function () {
                        debug("mod-a uninit'd");
                        cb();
                    }, DELAY);
                }
            }, {
                name: 'mod-b',
                init: function (cb) {
                    setTimeout(function () {
                        debug("mod-b init'd");
                        cb();
                    }, DELAY);
                },
                uninit: function (cb) {
                    debug("mod-b uniniting");
                    setTimeout(function () {
                        debug("mod-b uninit'd");
                        cb();
                    }, DELAY);
                },
                dependencies: ['mod-a']
            }, {
                name: 'mod-c',
                init: function (cb) {
                    setTimeout(function () {
                        debug("mod-c init'd");
                        cb();
                    }, DELAY);
                },
                uninit: function (cb) {
                    debug("mod-c uniniting");
                    setTimeout(function () {
                        debug("mod-c uninit'd");
                        cb();
                    }, DELAY);
                },
                dependencies: ['mod-a']
            }, {
                name: 'mod-d',
                init: function (cb) {
                    setTimeout(function () {
                        debug("mod-d init'd");
                        cb();
                    }, DELAY);
                },
                uninit: function (cb) {
                    debug("mod-d uniniting");
                    setTimeout(function () {
                        debug("mod-d uninit'd");
                        cb();
                    }, DELAY);
                },
                dependencies: ['mod-b', 'mod-c']
            }];
        });

        it('init test', function () {
            mods.forEach(function (mod) {
                graph.register(mod);
            });

            return graph.initialize();
        });

        it('uninit test', function () {
            mods.forEach(function (mod) {
                graph.register(mod);
            });

            return graph.initialize()
            .then(function () {
                return graph.uninitialize();
            });
        });
    });
});
