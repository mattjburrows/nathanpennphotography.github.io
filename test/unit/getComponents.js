'use strict';

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const components = fs.readFileSync(path.resolve(__dirname, './_tmp/components.js'), 'utf8');

module.exports = function getComponent(componentName) {
  const dom = new JSDOM('<div id="test-mount"></div>', {
    runScripts: 'outside-only',
    beforeParse(window) {
      window.requestAnimationFrame = (cb) => cb();
    }
  });
  const {
    window,
    window: {
      document
    }
  } = dom;
  const target = document.getElementById('test-mount');

  window.eval(components);

  return {
    window,
    document,
    render: (data) => {
      try {
        const component = new window.Components[componentName]({ target, data });
        return {
          element: target.firstChild,
          component
        };
      } catch (e) {
        console.log(e);
      }
    }
  };
};
