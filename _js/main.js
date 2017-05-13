'use strict';

import ToggleButton from './components/toggle-button.html';
import Gallery from './components/gallery.html';

const mainElement = document.querySelector('.js-main');

// Toggle button
const navigationToggle = new ToggleButton({
  target: document.querySelector('.js-navigation-toggle'),
  data: {
    classes: 'main__navigation__toggle'
  }
});
navigationToggle.on('toggle-button:click', toggleMainNavigationClass);

function toggleMainNavigationClass() {
  mainElement.classList.toggle('main--navigation-open');
}

// Gallery links
const gallery = new Gallery({
  target: document.querySelector('.js-gallery'),
  data: {
    images: window.galleryImages,
    title: `${document.title} gallery`
  }
});
gallery.observe('visibility', (visibility) => {
  if (visibility === 'visible') {
    mainElement.classList.remove('main--navigation-open');
  }
});

const galleryLinks = document.querySelectorAll('.js-gallery-click');
Array.prototype.forEach.call(galleryLinks, attachGalleryLinkListener);

function attachGalleryLinkListener(galleryLink, index) {
  galleryLink.addEventListener('click', handleGalleryLinkClick(index));
}

function handleGalleryLinkClick(index) {
  return (event) => {
    event.preventDefault();

    gallery.set({
      index,
      visibility: 'visible'
    });
  }
}
