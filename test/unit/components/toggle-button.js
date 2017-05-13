'use strict';

const assert = require('assert');
const cheerio = require('cheerio');
const sinon = require('sinon');

const { ToggleButton } = require('../_tmp/components');

function createContainer(data) {
  const container = document.createElement('div');
  return container;
}

describe('<ToggleButton>', () => {
  it('adds text', () => {
    const container = createContainer();
    const toggleButton = new ToggleButton({
      target: container,
      data: { text: 'foo bar' }
    });

    assert(container.querySelector('.toggle-button').textContent.indexOf('foo bar') > 0);
  });

  describe('labels', () => {
    it('defaults to "Open " when active is false', () => {
      const container = createContainer();
      const toggleButton = new ToggleButton({
        target: container,
        data: {
          active: false
        }
      });
      const toggleButtonMarkup = container.querySelector('.toggle-button');

      assert.equal(toggleButtonMarkup.querySelector('.toggle-button__label').textContent, 'Open ');
    });

    it('defaults to "Close " when active is true', () => {
      const container = createContainer();
      const toggleButton = new ToggleButton({
        target: container,
        data: {
          active: true
        }
      });
      const toggleButtonMarkup = container.querySelector('.toggle-button');

      assert.equal(toggleButtonMarkup.querySelector('.toggle-button__label').textContent, 'Close ');
    });
  });

  describe('click', () => {
    it('triggers "toggle-button:click" event when clicked and toggles the active state', () => {
      const spy = sinon.spy();
      const container = createContainer();
      const toggleButton = new ToggleButton({
        target: container,
        data: {}
      });

      toggleButton.on('toggle-button:click', spy);
      container.querySelector('.toggle-button').click();

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {
        active: true,
        type: 'toggle-button:click'
      });

      container.querySelector('.toggle-button').click();

      sinon.assert.calledTwice(spy);
      sinon.assert.calledWith(spy, {
        active: false,
        type: 'toggle-button:click'
      });
    });
  });
});
