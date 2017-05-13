const jsdom = require('jsdom').jsdom;

global.document = jsdom();
global.window = document.defaultView;
global.requestAnimationFrame = (cb) => cb();
