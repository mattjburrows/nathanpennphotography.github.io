'use strict';

const assert = require('assert');
const sinon = require('sinon');

const getComponents = require('../getComponents');

describe('<ToggleButton>', () => {
  it('adds text', () => {
    const { render } = getComponents('ToggleButton');
    const toggleButton = render({ text: 'foo bar' }).element;

    assert(toggleButton.textContent.indexOf('foo bar') > 0);
  });

  describe('labels', () => {
    it('defaults to "Open " when active is false', () => {
      const { render } = getComponents('ToggleButton');
      const toggleButton = render({ active: false }).element;

      assert.equal(toggleButton.querySelector('.toggle-button__label').textContent.trim(), 'Open');
    });

    it('defaults to "Close " when active is true', () => {
      const { render } = getComponents('ToggleButton');
      const toggleButton = render({ active: true }).element;

      assert.equal(toggleButton.querySelector('.toggle-button__label').textContent.trim(), 'Close');
    });
  });

  describe('click', () => {
    it('triggers "toggle-button:click" event when clicked and toggles the active state', () => {
      const spy = sinon.spy();
      const { render } = getComponents('ToggleButton');
      const toggleButton = render({});

      toggleButton.component.on('toggle-button:click', spy);
      toggleButton.element.click();

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {
        active: true,
        type: 'toggle-button:click'
      });

      toggleButton.element.click();

      sinon.assert.calledTwice(spy);
      sinon.assert.calledWith(spy, {
        active: false,
        type: 'toggle-button:click'
      });
    });
  });
});
