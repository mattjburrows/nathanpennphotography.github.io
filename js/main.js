(function () {
'use strict';

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function createElement ( name ) {
	return document.createElement( name );
}

function createSvgElement ( name ) {
	return document.createElementNS( 'http://www.w3.org/2000/svg', name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function createComment () {
	return document.createComment( '' );
}

function addEventListener ( node, event, handler ) {
	node.addEventListener( event, handler, false );
}

function removeEventListener ( node, event, handler ) {
	node.removeEventListener( event, handler, false );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute( attribute, value );
}

function setXlinkAttribute ( node, attribute, value ) {
	node.setAttributeNS( 'http://www.w3.org/1999/xlink', attribute, value );
}

function assign ( target ) {
	var arguments$1 = arguments;

	for ( var i = 1; i < arguments.length; i += 1 ) {
		var source = arguments$1[i];
		for ( var k in source ) { target[k] = source[k]; }
	}

	return target;
}

function differs ( a, b ) {
	return ( a !== b ) || ( a && ( typeof a === 'object' ) || ( typeof a === 'function' ) );
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) { continue; }

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( differs( newValue, oldValue ) ) {
			var callbacks = group[ key ];
			if ( !callbacks ) { continue; }

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) { continue; }

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var this$1 = this;

	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) { return; }

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this$1, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.post : this._observers.pre;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) { group[ key ].splice( index, 1 ); }
		}
	};
}

function on ( eventName, handler ) {
	if ( eventName === 'teardown' ) { return this.on( 'destroy', handler ); }

	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) { handlers.splice( index, 1 ); }
		}
	};
}

function set ( newState ) {
	this._set( assign( {}, newState ) );
	( this._root || this )._flush();
}

function _flush () {
	var this$1 = this;

	if ( !this._renderHooks ) { return; }

	while ( this._renderHooks.length ) {
		var hook = this$1._renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	_flush: _flush
};

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'classes' in newState && differs( state.classes, oldState.classes ) ) ) {
		state.getClasses = newState.getClasses = template.computed.getClasses( state.classes );
	}
	
	if ( isInitial || ( 'active' in newState && differs( state.active, oldState.active ) ) || ( 'labels' in newState && differs( state.labels, oldState.labels ) ) ) {
		state.getLabel = newState.getLabel = template.computed.getLabel( state.active, state.labels );
	}
}

var template = (function () {
  var EVENT_NAME_SPACE = 'toggle-button';
  return {
    data: function data() {
      return {
        active: false,
        classes: '',
        labels: {
          active: 'Close ',
          inactive: 'Open '
        },
        text: 'Menu'
      }
    },
    computed: {
      getClasses: function (classes) { return classes ? (" " + classes) : ''; },
      getLabel: function (active, labels) { return active ? labels.active : labels.inactive; }
    },
    methods: {
      onClick: function onClick(ref) {
        var active = ref.active;

        var eventName = EVENT_NAME_SPACE + ":click";

        this.set({ active: active });
        this.fire(eventName, {
          type: eventName,
          active: active
        });
      }
    }
  };
}());

function create_main_fragment ( state, component ) {
	var button_class_value, text_value, text_1_value;
	
	var button = createElement( 'button' );
	button.className = button_class_value = "toggle-button" + ( state.getClasses );
	
	function click_handler ( event ) {
		var state = component.get();
		component.onClick({ active: !state.active });
	}
	
	addEventListener( button, 'click', click_handler );
	var span = createElement( 'span' );
	appendNode( span, button );
	span.className = "toggle-button__label a11y";
	var text = createText( text_value = state.getLabel );
	appendNode( text, span );
	var text_1 = createText( text_1_value = state.text );
	appendNode( text_1, button );

	return {
		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
		},
		
		update: function ( changed, state ) {
			if ( button_class_value !== ( button_class_value = "toggle-button" + ( state.getClasses ) ) ) {
				button.className = button_class_value;
			}
			
			if ( text_value !== ( text_value = state.getLabel ) ) {
				text.data = text_value;
			}
			
			if ( text_1_value !== ( text_1_value = state.text ) ) {
				text_1.data = text_1_value;
			}
		},
		
		destroy: function ( detach ) {
			removeEventListener( button, 'click', click_handler );
			
			if ( detach ) {
				detachNode( button );
			}
		}
	};
}

function Toggle_button$1 ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );
	recompute( this._state, this._state, {}, true );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = create_main_fragment( this._state, this );
	if ( options.target ) { this._fragment.mount( options.target, null ); }
}

assign( Toggle_button$1.prototype, template.methods, proto );

Toggle_button$1.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) { this._fragment.update( newState, this._state ); }
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Toggle_button$1.prototype.teardown = Toggle_button$1.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute$2 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'classes' in newState && differs( state.classes, oldState.classes ) ) ) {
		state.getClasses = newState.getClasses = template$2.computed.getClasses( state.classes );
	}
}

var template$2 = (function () {
  var EVENT_NAME_SPACE = 'button';

  return {
    data: function data() {
      return {
        icon: '',
        id: '',
        text: '',
        classes: '',
        disabled: false
      }
    },
    computed: {
      getClasses: function (classes) { return classes ? (" " + classes) : ''; },
    },
    methods: {
      onClick: function onClick(id) {
        var eventName = EVENT_NAME_SPACE + ":click";

        this.fire(eventName, {
          type: eventName,
          id: id
        });
      }
    }
  };
}());

function create_main_fragment$2 ( state, component ) {
	var button_class_value, button_disabled_value, text_value, use_xlink_href_value, use_href_value;
	
	var button = createElement( 'button' );
	button.className = button_class_value = "icon-button" + ( state.getClasses );
	button.disabled = button_disabled_value = state.disabled;
	
	function click_handler ( event ) {
		var state = component.get();
		component.onClick(state.id);
	}
	
	addEventListener( button, 'click', click_handler );
	var span = createElement( 'span' );
	appendNode( span, button );
	span.className = "a11y";
	var text = createText( text_value = state.text );
	appendNode( text, span );
	appendNode( createText( "\n  " ), button );
	var svg = createSvgElement( 'svg' );
	appendNode( svg, button );
	setAttribute( svg, 'role', "presentation" );
	setAttribute( svg, 'class', "icon-button__icon" );
	var use = createSvgElement( 'use' );
	appendNode( use, svg );
	setAttribute( use, 'xmlns:xlink', "http://www.w3.org/1999/xlink" );
	setXlinkAttribute( use, 'xlink:href', use_xlink_href_value = "#" + ( state.icon ) );
	setAttribute( use, 'href', use_href_value = "#" + ( state.icon ) );

	return {
		mount: function ( target, anchor ) {
			insertNode( button, target, anchor );
		},
		
		update: function ( changed, state ) {
			if ( button_class_value !== ( button_class_value = "icon-button" + ( state.getClasses ) ) ) {
				button.className = button_class_value;
			}
			
			if ( button_disabled_value !== ( button_disabled_value = state.disabled ) ) {
				button.disabled = button_disabled_value;
			}
			
			if ( text_value !== ( text_value = state.text ) ) {
				text.data = text_value;
			}
			
			if ( use_xlink_href_value !== ( use_xlink_href_value = "#" + ( state.icon ) ) ) {
				setXlinkAttribute( use, 'xlink:href', use_xlink_href_value );
			}
			
			if ( use_href_value !== ( use_href_value = "#" + ( state.icon ) ) ) {
				setAttribute( use, 'href', use_href_value );
			}
		},
		
		destroy: function ( detach ) {
			removeEventListener( button, 'click', click_handler );
			
			if ( detach ) {
				detachNode( button );
			}
		}
	};
}

function Icon_button ( options ) {
	options = options || {};
	this._state = assign( template$2.data(), options.data );
	recompute$2( this._state, this._state, {}, true );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	
	this._fragment = create_main_fragment$2( this._state, this );
	if ( options.target ) { this._fragment.mount( options.target, null ); }
}

assign( Icon_button.prototype, template$2.methods, proto );

Icon_button.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$2( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) { this._fragment.update( newState, this._state ); }
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Icon_button.prototype.teardown = Icon_button.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute$1 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'images' in newState && differs( state.images, oldState.images ) ) || ( 'index' in newState && differs( state.index, oldState.index ) ) ) {
		state.getImageSrc = newState.getImageSrc = template$1.computed.getImageSrc( state.images, state.index );
		state.getImageAlt = newState.getImageAlt = template$1.computed.getImageAlt( state.images, state.index );
		state.getImageDescription = newState.getImageDescription = template$1.computed.getImageDescription( state.images, state.index );
	}
}

var template$1 = (function () {
  var EVENT_NAME_SPACE = 'gallery';

  function determineIndex(id, imageCount, index) {
    if (id === 'previous') {
      return (index > 0) ? (index - 1) : imageCount;
    } else if (id === 'next') {
      return (index < imageCount) ? (index + 1) : 0;
    }

    return 0;
  }

  function removeGallery(gallery) {
    return function (event) {
      if (event.keyCode !== 27) { return; }

      gallery.set({ visibility: 'hidden' });
    };
  }

  function focusGallery(gallery) {
    return function () {
      if (!gallery.refs.gallery) { return; }
      gallery.refs.gallery.focus();
    };
  }

  return {
    data: function data() {
      return {
        images: [],
        index: 0,
        title: '',
        visibility: 'hidden'
      };
    },
    oncreate: function oncreate() {
      var gallery = this;
      var keypressHandler = removeGallery(gallery);

      this.observe('visibility', function (visibility) {
        if (visibility === 'visible') {
          requestAnimationFrame(focusGallery(gallery));
          window.addEventListener('keyup', keypressHandler);
        } else if (visibility === 'hidden') {
          window.removeEventListener('keyup', keypressHandler);
        }
      });
    },
    computed: {
      getImageSrc: function (images, index) {
        return images[index].src;
      },
      getImageAlt: function (images, index) {
        return images[index].alt;
      },
      getImageDescription: function (images, index) {
        return images[index].description;
      }
    },
    methods: {
      onButtonClick: function onButtonClick(event) {
        var id = event.id;
        var images = this.get('images');
        var prevIndex = this.get('index');
        var imageCount = (images.length - 1);
        var currIndex = determineIndex(id, imageCount, prevIndex);
        var eventName = EVENT_NAME_SPACE + ":button:click";

        this.set({ index: currIndex });
        this.fire(eventName, {
          type: eventName,
          index: currIndex,
          image: images[currIndex]
        });
      }
    }
  };
}());

function create_main_fragment$1 ( state, component ) {
	var if_block_anchor = createComment();
	
	var if_block = state.visibility === 'visible' && create_if_block( state, component );

	return {
		mount: function ( target, anchor ) {
			insertNode( if_block_anchor, target, anchor );
			if ( if_block ) { if_block.mount( target, null ); }
		},
		
		update: function ( changed, state ) {
			if ( state.visibility === 'visible' ) {
				if ( if_block ) {
					if_block.update( changed, state );
				} else {
					if_block = create_if_block( state, component );
					if_block.mount( if_block_anchor.parentNode, if_block_anchor );
				}
			} else if ( if_block ) {
				if_block.destroy( true );
				if_block = null;
			}
		},
		
		destroy: function ( detach ) {
			if ( if_block ) { if_block.destroy( detach ); }
			
			if ( detach ) {
				detachNode( if_block_anchor );
			}
		}
	};
}

function create_if_block ( state, component ) {
	var text_value, img_src_value, img_alt_value, text_3_value;
	
	var section = createElement( 'section' );
	section.className = "gallery";
	setAttribute( section, 'role', "dialog" );
	setAttribute( section, 'aria-live', "polite" );
	setAttribute( section, 'aria-labelledby', "gallery-title" );
	setAttribute( section, 'aria-describedby', "gallery-description" );
	section.tabIndex = "-1";
	component.refs.gallery = section;
	var p = createElement( 'p' );
	appendNode( p, section );
	p.id = "gallery-title";
	p.className = "a11y";
	var text = createText( text_value = state.title );
	appendNode( text, p );
	appendNode( createText( "\n  " ), section );
	var figure = createElement( 'figure' );
	appendNode( figure, section );
	figure.className = "gallery__fig";
	var img = createElement( 'img' );
	appendNode( img, figure );
	img.src = img_src_value = state.getImageSrc;
	img.alt = img_alt_value = state.getImageAlt;
	img.className = "gallery__fig__image";
	appendNode( createText( "\n    " ), figure );
	var figcaption = createElement( 'figcaption' );
	appendNode( figcaption, figure );
	figcaption.id = "gallery-description";
	figcaption.className = "gallery__fig__caption";
	var text_3 = createText( text_3_value = state.getImageDescription );
	appendNode( text_3, figcaption );
	appendNode( createText( "\n  " ), section );
	
	var iconbutton = new Icon_button({
		target: section,
		_root: component._root || component,
		data: {
			id: "previous",
			icon: "icon-previous",
			classes: "gallery__btn gallery__btn--previous",
			text: "View previous image"
		}
	});
	
	iconbutton.on( 'button:click', function ( event ) {
		component.onButtonClick(event);
	});
	
	appendNode( createText( "\n  " ), section );
	
	var iconbutton_1 = new Icon_button({
		target: section,
		_root: component._root || component,
		data: {
			id: "next",
			icon: "icon-next",
			classes: "gallery__btn gallery__btn--next",
			text: "View next image"
		}
	});
	
	iconbutton_1.on( 'button:click', function ( event ) {
		component.onButtonClick(event);
	});
	
	appendNode( createText( "\n  " ), section );
	
	var iconbutton_2 = new Icon_button({
		target: section,
		_root: component._root || component,
		data: {
			id: "close",
			icon: "icon-no",
			classes: "icon-button--small gallery__btn gallery__btn--close",
			text: "Close gallery"
		}
	});
	
	iconbutton_2.on( 'button:click', function ( event ) {
		component.set({visibility: 'hidden'});
	});

	return {
		mount: function ( target, anchor ) {
			insertNode( section, target, anchor );
		},
		
		update: function ( changed, state ) {
			if ( text_value !== ( text_value = state.title ) ) {
				text.data = text_value;
			}
			
			if ( img_src_value !== ( img_src_value = state.getImageSrc ) ) {
				img.src = img_src_value;
			}
			
			if ( img_alt_value !== ( img_alt_value = state.getImageAlt ) ) {
				img.alt = img_alt_value;
			}
			
			if ( text_3_value !== ( text_3_value = state.getImageDescription ) ) {
				text_3.data = text_3_value;
			}
		},
		
		destroy: function ( detach ) {
			if ( component.refs.gallery === section ) { component.refs.gallery = null; }
			iconbutton.destroy( false );
			iconbutton_1.destroy( false );
			iconbutton_2.destroy( false );
			
			if ( detach ) {
				detachNode( section );
			}
		}
	};
}

function Gallery ( options ) {
	options = options || {};
	this.refs = {};
	this._state = assign( template$1.data(), options.data );
	recompute$1( this._state, this._state, {}, true );
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	this._renderHooks = [];
	
	this._fragment = create_main_fragment$1( this._state, this );
	if ( options.target ) { this._fragment.mount( options.target, null ); }
	
	this._flush();
	
	if ( options._root ) {
		options._root._renderHooks.push({ fn: template$1.oncreate, context: this });
	} else {
		template$1.oncreate.call( this );
	}
}

assign( Gallery.prototype, template$1.methods, proto );

Gallery.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$1( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) { this._fragment.update( newState, this._state ); }
	dispatchObservers( this, this._observers.post, newState, oldState );
	
	this._flush();
};

Gallery.prototype.teardown = Gallery.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	this._fragment.destroy( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var mainElement = document.querySelector('.js-main');

// Toggle button
var navigationToggle = new Toggle_button$1({
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
var gallery = new Gallery({
  target: document.querySelector('.js-gallery'),
  data: {
    images: window.galleryImages,
    title: ((document.title) + " gallery")
  }
});
gallery.observe('visibility', function (visibility) {
  if (visibility === 'visible') {
    mainElement.classList.remove('main--navigation-open');
  }
});

var galleryLinks = document.querySelectorAll('.js-gallery-click');
Array.prototype.forEach.call(galleryLinks, attachGalleryLinkListener);

function attachGalleryLinkListener(galleryLink, index) {
  galleryLink.addEventListener('click', handleGalleryLinkClick(index));
}

function handleGalleryLinkClick(index) {
  return function (event) {
    event.preventDefault();

    gallery.set({
      index: index,
      visibility: 'visible'
    });
  }
}

}());
