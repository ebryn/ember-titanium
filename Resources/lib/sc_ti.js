var window = this;
Ti.include('/lib/sproutcore-runtime.js');
console.log = console.info = console.warn = console.error = Ti.API.info;

var queues = SC.run.queues;
queues.insertAt(queues.indexOf('actions')+1, 'render');

(function() {
  var get = SC.get, set = SC.set;
  
  SCTi = {};
  
  // Mixins
  SCTi.Openable = {
    open: function() {
      this.render();
      get(this, 'tiObject').open();
      
      return this;
    },
    
    close: function(options) {
      this.render();
      get(this, 'tiObject').close(options);
      
      return this;
    }
  };
  
  SCTi.Hideable = {
    hide: function() {
      this.render();
      get(this, 'tiObject').hide();
      
      return this;
    },
    
    show: function() {
      this.render();
      get(this, 'tiObject').show();
      
      return this;
    }
  };
  
  // SproutCore Wrapped Titanium Objects
  SCTi.Object = SC.Object.extend({
    tiObject: null,
    tiOptions: [],
    tiEvents: [],
    
    concatenatedProperties: ['tiOptions', 'tiEvents'],
    
    init: function() {
      this._super();
      
      // Use slice to create copies of the following arrays.
      var tiOptions = get(this, 'tiOptions').slice(),
          tiEvents = get(this, 'tiEvents').slice();

      set(this, 'tiOptions', tiOptions);
      set(this, 'tiEvents', tiEvents);
    },
    
    createTiObject: function(options) {
      return this;
    },
    
    createObject: function() {
      var tiObject = get(this, 'tiObject');
      
      if (!tiObject) {
        var tiObject = this.createTiObject(this.optionsForTiObject());
        set(this, 'tiObject', tiObject);
        this.createObservers();
      }
       
      return tiObject;
    },
    
    render: function() {
      var tiObject = this.createObject();
      
      if (get(this, 'isRendered')) { return this; }
      
      SC.run.sync(); // FIXME: is this okay?
      
      this.registerEvents();
      
      set(this, 'isRendered', true);
      
      return this;
    },
    
    optionsForTiObject: function() {
      var self = this, tiObjectOptions = {};
      
      this.forEachValidTiOption(function(optionName) {
        var optionVal = get(self, optionName);
        // Assign the Ti Object if the value is an SC wrapped Ti Object
        if (optionVal instanceof SCTi.Object) {
          optionVal.render();
          tiObjectOptions[optionName] = get(optionVal, 'tiObject'); 
        }
        else {
          tiObjectOptions[optionName] = get(self, optionName); 
        }
      });
      
      return tiObjectOptions;
    },
    
    registerEvents: function() {
      var self = this, tiObject = get(this, 'tiObject'), tiEvents = get(this, 'tiEvents');
      tiEvents.forEach(function(eventName) {
        var tiEvent = eventName.split(':')[0];
        var scFunction = eventName.split(':')[1] || tiEvent;
        var handler = get(self, scFunction);
        if (handler && typeof handler === 'function') {
          tiObject.addEventListener(tiEvent, function(event) { handler.call(self, event); });
        }
      });
    },

    forEachValidTiOption: function(callback) {
      var self = this, tiOptions = get(this, 'tiOptions');

      tiOptions.forEach(function(optionName) {
        var val = get(self, optionName);
        if (val !== undefined && val !== null) {
          callback.call(this, optionName);
        }
      });

      return this;
    },

    createObservers: function() {
      var self = this;

      this.forEachValidTiOption(function(optionName) {
        var observer = function() {
          var tiObject = get(this, 'tiObject');
          var currentValue = tiObject[optionName], newValue = get(this, optionName);

          if (newValue !== currentValue) {
            tiObject[optionName] = newValue;
          }
        };

        SC.addObserver(self, optionName, observer);
      });
    }
  });
  
  SCTi.View = SCTi.Object.extend(SCTi.Hideable, {
    tiOptions: 'anchorPoint animatedCenterPoint backgroundColor backgroundDisabledColor backgroundDisabledImage backgroundFocusedColor backgroundFocusedImage backgroundGradient backgroundImage backgroundLeftCap backgroundSelectedColor backgroundSelectedImage backgroundTopCap borderColor borderRadius borderWidth bottom center focusable font fontFamily fontSize fontStyle fontWeight height layout left opacity right size softKeyboardOnFocus top touchEnabled transform visible width zIndex'.w(),
    tiEvents: 'click dblclick doubletap singletap swipe touchcancel touchend touchmove touchstart twofingertap'.w(),
    
    childViews: [],
    
    init: function() {
      this._super();
      
      // Use slice to create copies of the following arrays.
      var childViews = get(this, 'childViews').slice();

      set(this, 'childViews', childViews);
    },
    
    createTiObject: function(options) {
      return Ti.UI.createView(options);
    },
    
    add: function(view) {
      var childViews = get(this, 'childViews');
      childViews.push(view);
      return this;
    },
    
    addChildView: function(tiObject, childView) {
      tiObject.add(get(childView, 'tiObject'));
    },
    
    render: function() {
      var tiObject = this.createObject(), childViews = get(this, 'childViews');
      
      if (get(this, 'isRendered')) { return this; }

      for (var i = 0; i < childViews.length; i++) {
        var childView = childViews[i];
        childView.render();
        this.addChildView(tiObject, childView);
      }
      
      return this._super();
    }
  });
  
  SCTi.Window = SCTi.View.extend(SCTi.Openable, {
    tiOptions: 'backButtonTitle backButtonTitleImage barColor barImage exitOnClose fullscreen leftNavButton modal navBarHidden orientationModes rightNavButton tabBarHidden title titleControl titleImage titlePrompt titleid titlepromptid toolbar translucent url windowSoftInputMode'.w(),
    tiEvents: 'android:back android:camera android:focus android:search android:voldown android:volup blur close:closed focus open:opened'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createWindow(options);
    }
  });
  
  SCTi.Label = SCTi.View.extend({
    tiOptions: 'autoLink backgroundPaddingBottom backgroundPaddingLeft backgroundPaddingRight backgroundPaddingTop color ellipsize font highlightedColor html minimumFontSize shadowColor shadowOffset text textAlign textid wordWrap'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createLabel(options);
    }
  });
  
  SCTi.TextField = SCTi.View.extend({
    tiOptions: 'autocapitalization borderStyle clearButtonMode clearOnEdit editable enabled hintText keyboardToolbar keyboardToolbarColor keyboardToolbarHeight leftButton leftButtonMode leftButtonPadding minimumFontSize paddingLeft paddingRight rightButton rightButtonMode rightButtonPadding suppressReturn value verticalAlign'.w(),
    tiEvents: 'focus blur change hasText'.w(),
    
    createTiObject: function(options) {
      options.borderStyle = options.borderStyle || Ti.UI.INPUT_BORDERSTYLE_NONE;
      return Ti.UI.createTextField(options);
    },

    change: function() {
      var self = this, tiObject = get(this, 'tiObject');
      set(self, 'value', tiObject.value);
    }
  });
  
  SCTi.Button = SCTi.View.extend({
    tiOptions: 'color enabled font image selectedColor style title titleid'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createButton(options);
    }
  });
  
  SCTi.Tab = SCTi.View.extend({
    tiOptions: 'badge icon title window'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createTab(options);
    }
  });

  SCTi.TabGroup = SCTi.View.extend(SCTi.Openable, {
    tiOptions: 'activeTab allowUserCustomization barColor editButtonTitle tabs windowSoftInputMode'.w(),
    tiEvents: 'blur close:closed focus open:opened'.w(),
    
    addChildView: function(tiObject, childView) {
      tiObject.addTab(get(childView, 'tiObject'));
    },

    createTiObject: function(options) {
      return Ti.UI.createTabGroup(options);
    },
    
    setActiveTab: function(tabIndex) {
      this.render();
      get(this, 'tiObject').setActiveTab(tabIndex);
      
      return this;
    }
  });
  
  SCTi.ImageView = SCTi.View.extend({
    tiOptions: 'animating canScale decodeRetries defaultImage duration enableZoomControls hires image images paused preventDefaultImage repeatCount reverse'.w(),
    tiEvents: 'change load start stop'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createImageView(options);
    }
  });

  SCTi.TextArea = SCTi.View.extend({
    tiOptions: 'autoLink autocapitalization editable enabled keyboardToolbar keyboardToolbarColor keyboardToolbarHeight suppressReturn value'.w(),
    tiEvents: 'blur change focus return selected'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createTextArea(options);
    }
  });
  
  SCTi.AlertDialog = SCTi.Object.extend(SCTi.Hideable, {
    tiOptions: 'buttonNames cancel message messageid title'.w(),
    tiEvents: 'click'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createAlertDialog(options);
    }
  });
  
})();
