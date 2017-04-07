# initgraph

Initialize and uninitialize modules in the order of their dependency graph.

When you have many modules each of which may have dependencies to others, the order of
initialization matters. This module will help resolving the initialization order for you.

For example, when you have modules, A, B, C and D with the following dependencies:

```
      <<depends>> +---+ <<depends>>
           +----->| B |-----+
   +---+   |      +---+     |    +---+
   | A |---+                +--->| D |
   +---+   |      +---+     |    +---+
           +----->| C |-----+
                  +---+
```

You would need to initialize these modules A, B and C, then finally D. Also, you would need to
uninitialize these modules in the reverse order; D, B and C, then A. This module help doing so for you.

## Installation
```
$ npm i initgraph
```


## Usage

### Requirements to your modules to be initialized
Your modules need to expose following properties:
* name {string}: Name of the module.
* init {function}: Initialization method.
* uninit {function}: Uninitialization method. (optional)
* dependencies {array}: A list of name of modules that this module depend.

The init() and uninit() are expected to return a Promise. It is allowed to have
these method take a callback. (will be promisified internally using bluebird)

### Example

```js
// See ./examples/simple.js
const initgraph = require('initgraph').create();

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
```

Here's the result:
```
$ node examples/simple.js
modA: init'd
modB: init'd
modC: init'd
modD: init'd
init complete
modD: uninit'd
modC: uninit'd
modB: uninit'd
modA: uninit'd
uninit complete
```

It's hard to tell with this example, but the initialization (or uninitialization) of modB and modC are done concurrently.

## API

### require('initgraph').create()
Instantiate a new initgraph.

### initgraph.register(module {Object}) => {Promise}
Register a module to be initialized / uninitialized.

### initgraph.initialize([cb]) => {Promise}
Initialize the registered modules.
Returns a Promise if `cb` is not provided.

### initgraph.uninitialize([cb]) => {Promise}
Uninitialize the registered modules.
Returns a Promise if `cb` is not provided.

## LICENSE

```
The MIT License (MIT)

Copyright (c) 2017 Yutaka Takeda.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
