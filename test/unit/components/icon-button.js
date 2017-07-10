'use strict';

const assert = require('assert');
const sinon = require('sinon');

const getComponents = require('../getComponents');

describe('<IconButton>', () => {
  it('adds text', () => {
    const { render } = getComponents('IconButton');
    const iconButton = render({ text: 'foo bar' }).element;

    assert.equal(iconButton.textContent.trim(), 'foo bar');
  });

  it('adds classes', () => {
    const { render } = getComponents('IconButton');
    const iconButton = render({ classes: 'foo bar' }).element;

    assert.equal(iconButton.getAttribute('class'), 'icon-button foo bar');
  });

  describe('disabled attribute', () => {
    it('defaults to false', () => {
      const { render } = getComponents('IconButton');
      const iconButton = render({}).element;

      assert.strictEqual(iconButton.getAttribute('disabled'), null);
    });

    it('true when specified', () => {
      const { render } = getComponents('IconButton');
      const iconButton = render({ disabled: true }).element;

      assert(iconButton.getAttribute('disabled') !== null);
    });
  });

  describe('click', () => {
    it('triggers "button:click" event when clicked', () => {
      const spy = sinon.spy();
      const { render } = getComponents('IconButton');
      const iconButton = render({ id: 'foo' });

      iconButton.component.on('button:click', spy);
      iconButton.element.click();

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {
        id: 'foo',
        type: 'button:click'
      });
    });
  });
});
