'use strict';

const _ = require('lodash');
const assert = require('assert');
const cheerio = require('cheerio');
const sinon = require('sinon');

const { Gallery } = require('../_tmp/components');

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
const title = 'This is the title';

function createContainer(data) {
  const container = document.createElement('div');

  container.setAttribute('id', 'test');
  document.body.appendChild(container);

  return container;
}

function removeContainer() {
  const container = document.querySelector('#test');

  container.parentNode.removeChild(container);
}

function triggerEscapeKeyEvent() {
  const event = new window.Event('keyup');
  event.keyCode = 27;

  window.dispatchEvent(event);
}

describe('<Gallery>', () => {
  afterEach(removeContainer);

  describe('Visibility', () => {
    it('hidden by default', () => {
      const container = createContainer();
      const gallery = new Gallery({
        target: container,
        data: { images, title }
      });

      assert.equal(container.querySelector('.gallery'), null);
    });

    it('visible when set and is the focussed element', () => {
      const visibility = 'visible';
      const container = createContainer();
      const gallery = new Gallery({
        target: container,
        data: { images, title, visibility }
      });

      assert(container.firstElementChild.classList.contains('gallery'));
      assert(document.activeElement.classList.contains('gallery'));
    });

    describe('when its visible', () => {
      const visibility = 'visible';

      it('sets the correct title', () => {
        const container = createContainer();
        const gallery = new Gallery({
          target: container,
          data: { images, title, visibility }
        });

        assert.equal(container.querySelector('#gallery-title').textContent, title);
      });

      describe('previous button', () => {
        it('dispatches an event when clicked', (done) => {
          const container = createContainer();
          const gallery = new Gallery({
            target: container,
            data: { images, title, visibility }
          });
          const previousImageBtn = container.querySelector('.gallery__btn--previous');

          gallery.on('gallery:button:click', (event) => {
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
          const container = createContainer();
          const gallery = new Gallery({
            target: container,
            data: { images, title, visibility }
          });
          const previousImageBtn = container.querySelector('.gallery__btn--previous');
          const image = container.querySelector('.gallery__fig__image');
          const description = container.querySelector('.gallery__fig__caption');

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
          const container = createContainer();
          const gallery = new Gallery({
            target: container,
            data: { images, title, visibility, index }
          });
          const nextImageBtn = container.querySelector('.gallery__btn--next');

          gallery.on('gallery:button:click', (event) => {
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
          const container = createContainer();
          const gallery = new Gallery({
            target: container,
            data: { images, title, visibility, index }
          });
          const nextImageBtn = container.querySelector('.gallery__btn--next');
          const image = container.querySelector('.gallery__fig__image');
          const description = container.querySelector('.gallery__fig__caption');

          _.range(images.length).forEach((number) => {
            nextImageBtn.click();

            assert.equal(image.getAttribute('src'), images[number].src);
            assert.equal(image.getAttribute('alt'), images[number].alt);
            assert.equal(description.textContent, images[number].description);
          });
        });
      });

      it('closes the gallery when the close button is clicked', () => {
        const container = createContainer();
        const index = (images.length - 1);
        const gallery = new Gallery({
          target: container,
          data: { images, title, visibility, index }
        });
        const closeBtn = container.querySelector('.gallery__btn--close');

        assert(container.firstElementChild.classList.contains('gallery'));

        closeBtn.click();

        assert.equal(container.querySelector('.gallery'), null);
      });

      it('closes the gallery when the escape key is pressed', () => {
        const container = createContainer();
        const index = (images.length - 1);
        const gallery = new Gallery({
          target: container,
          data: { images, title, visibility, index }
        });

        assert(container.firstElementChild.classList.contains('gallery'));

        triggerEscapeKeyEvent();

        assert.equal(container.querySelector('.gallery'), null);
      });
    });
  });
});
