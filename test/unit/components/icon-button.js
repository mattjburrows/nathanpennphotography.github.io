'use strict';

const assert = require('assert');
const cheerio = require('cheerio');
const sinon = require('sinon');

const { IconButton } = require('../_tmp/components');

function createContainer(data) {
  const container = document.createElement('div');
  return container;
}

describe('<IconButton>', () => {
  it('adds text', () => {
    const container = createContainer();
    const button = new IconButton({
      target: container,
      data: { text: 'foo bar' }
    });

    assert.equal(container.querySelector('.icon-button').textContent.trim(), 'foo bar');
  });

  it('adds classes', () => {
    const container = createContainer();
    const button = new IconButton({
      target: container,
      data: { classes: 'foo bar' }
    });

    assert.equal(container.querySelector('.icon-button').getAttribute('class'), 'icon-button foo bar');
  });

  describe('disabled attribute', () => {
    it('defaults to false', () => {
      const container = createContainer();
      const button = new IconButton({
        target: container,
        data: {}
      });

      assert(container.querySelector('.icon-button').getAttribute('disabled') === null);
    });

    it('true when specified', () => {
      const container = createContainer();
      const button = new IconButton({
        target: container,
        data: { disabled: true }
      });

      assert(container.querySelector('.icon-button').getAttribute('disabled') !== null);
    });
  });

  describe('click', () => {
    it('triggers "button:click" event when clicked', () => {
      const spy = sinon.spy();
      const container = createContainer();
      const button = new IconButton({
        target: container,
        data: { id: 'foo' }
      });

      button.on('button:click', spy);
      container.querySelector('.icon-button').click();

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {
        id: 'foo',
        type: 'button:click'
      });
    });
  });
});
