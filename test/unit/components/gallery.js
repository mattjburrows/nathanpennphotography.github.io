'use strict';

const _ = require('lodash');
const assert = require('assert');
const sinon = require('sinon');

const getComponents = require('../getComponents');

const title = 'This is the title';
const images = [{
  src: 'https://img.uno.com/460/300',
  alt: 'Uno alt',
  description: 'Uno description'
}, {
  src: 'https://img.dos.com/460/300',
  alt: 'Dos alt',
  description: 'Dos description'
}, {
  src: 'https://img.tres.com/460/300',
  alt: 'Tres alt',
  description: 'Tres description'
}];

function triggerEscapeKeyEvent(window) {
  const event = new window.Event('keyup');
  event.keyCode = 27;

  window.dispatchEvent(event);
}

describe('<Gallery>', () => {
  describe('Visibility', () => {
    it('hidden by default', () => {
      const { render } = getComponents('Gallery');
      const gallery = render({ images, title }).element;

      assert.strictEqual(gallery.tagName, undefined);
    });

    it('visible when set and is the focussed element', () => {
      const visibility = 'visible';
      const { render, document } = getComponents('Gallery');
      const gallery = render({ images, title, visibility }).element;

      assert(document.getElementById('test-mount').firstElementChild.classList.contains('gallery'));
      assert(document.activeElement.classList.contains('gallery'));
    });

    describe('when its visible', () => {
      const visibility = 'visible';

      it('sets the correct title', () => {
        const { render } = getComponents('Gallery');
        const gallery = render({ images, title, visibility }).element;

        assert.equal(gallery.querySelector('#gallery-title').textContent, title);
      });

      it('closes the gallery when the close button is clicked', () => {
        const index = (images.length - 1);
        const { render, document } = getComponents('Gallery');
        const gallery = render({ images, title, visibility, index }).element;
        const closeBtn = gallery.querySelector('.gallery__btn--close');

        assert(gallery.classList.contains('gallery'));

        closeBtn.click();

        assert.strictEqual(document.querySelector('.gallery'), null);
      });

      it('closes the gallery when the escape key is pressed', () => {
        const index = (images.length - 1);
        const { render, document, window } = getComponents('Gallery');
        const gallery = render({ images, title, visibility, index }).element;

        assert(gallery.classList.contains('gallery'));

        triggerEscapeKeyEvent(window);

        assert.strictEqual(document.querySelector('.gallery'), null);
      });

      describe('previous button', () => {
        it('dispatches an event when clicked', (done) => {
          const { render } = getComponents('Gallery');
          const gallery = render({ images, title, visibility });
          const previousImageBtn = gallery.element.querySelector('.gallery__btn--previous');

          gallery.component.on('gallery:button:click', (event) => {
            assert.deepEqual(event, {
              type: 'gallery:button:click',
              index: 2,
              image: images[2]
            });

            done();
          });

          previousImageBtn.click();
        });

        it('cycles backwards through the images when clicked', () => {
          const { render } = getComponents('Gallery');
          const gallery = render({ images, title, visibility });
          const previousImageBtn = gallery.element.querySelector('.gallery__btn--previous');
          const image = gallery.element.querySelector('.gallery__fig__image');
          const description = gallery.element.querySelector('.gallery__fig__caption');

          _.rangeRight(images.length).forEach((number) => {
            previousImageBtn.click();

            assert.equal(image.getAttribute('src'), images[number].src);
            assert.equal(image.getAttribute('alt'), images[number].alt);
            assert.equal(description.textContent, images[number].description);
          });
        });
      });

      describe('next button', () => {
        const index = (images.length - 1);

        it('dispatches an event when clicked', (done) => {
          const { render } = getComponents('Gallery');
          const gallery = render({ images, title, visibility, index });
          const nextImageBtn = gallery.element.querySelector('.gallery__btn--next');

          gallery.component.on('gallery:button:click', (event) => {
            assert.deepEqual(event, {
              type: 'gallery:button:click',
              index: 0,
              image: images[0]
            });

            done();
          });

          nextImageBtn.click();
        });

        it('cycles forward through the images when clicked', () => {
          const { render } = getComponents('Gallery');
          const gallery = render({ images, title, visibility, index });
          const nextImageBtn = gallery.element.querySelector('.gallery__btn--next');
          const image = gallery.element.querySelector('.gallery__fig__image');
          const description = gallery.element.querySelector('.gallery__fig__caption');

          _.range(images.length).forEach((number) => {
            nextImageBtn.click();

            assert.equal(image.getAttribute('src'), images[number].src);
            assert.equal(image.getAttribute('alt'), images[number].alt);
            assert.equal(description.textContent, images[number].description);
          });
        });
      });
    });
  });
});
