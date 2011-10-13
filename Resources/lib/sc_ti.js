var window = this;
Ti.include('/lib/sproutcore-runtime.js');
console.log = console.info = console.warn = console.error = Ti.API.info;

var queues = SC.run.queues;
queues.insertAt(queues.indexOf('actions')+1, 'render');

(function() {
  var get = SC.get, set = SC.set;
  
  SCTi = {};
  
  // Constants
  SCTi.AUTOCAPITALIZATION_CONSTANTS = {
    all: Ti.UI.TEXT_AUTOCAPITALIZATION_ALL,
    none: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
    sentences: Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES,
    words: Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS
  };
  
  SCTi.KEYBOARD_TYPE_CONSTANTS = {
    ascii: Ti.UI.KEYBOARD_ASCII,
    'default': Ti.UI.KEYBOARD_DEFAULT,
    email: Ti.UI.KEYBOARD_EMAIL,
    alphanumeric: Ti.UI.KEYBOARD_NAMEPHONE_PAD,
    numbers_punctuation: Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION,
    numbers: Ti.UI.KEYBOARD_NUMBER_PAD,
    phone: Ti.UI.KEYBOARD_PHONE_PAD,
    url: Ti.UI.KEYBOARD_URL
  };
  
  SCTi.RETURNKEY_CONSTANTS = {
    'default': Ti.UI.RETURNKEY_DEFAULT,
    done: Ti.UI.RETURNKEY_DONE,
    emergency_call: Ti.UI.RETURNKEY_EMERGENCY_CALL,
    go: Ti.UI.RETURNKEY_GO,
    google: Ti.UI.RETURNKEY_GOOGLE,
    join: Ti.UI.RETURNKEY_JOIN,
    next: Ti.UI.RETURNKEY_NEXT,
    route: Ti.UI.RETURNKEY_ROUTE,
    search: Ti.UI.RETURNKEY_SEARCH,
    send: Ti.UI.RETURNKEY_SEND,
    yahoo: Ti.UI.RETURNKEY_YAHOO
  };
  
  // Mixins
  SCTi.Animatable = {
    animate: function(scAnimation) {
      this.render();
      scAnimation.render();
      get(this, 'tiObject').animate(get(scAnimation, 'tiObject'));
      
      return this;
    }
  };
  
  SCTi.Openable = {
    open: function(options) {
      this.render();
      get(this, 'tiObject').open(options);
      
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
  
  SCTi.Focusable = {
    tiEvents: 'focus:focused blur:blurred'.w(),
    
    blur: function() {
      this.render();
      get(this, 'tiObject').blur();

      return this;
    },
    
    focus: function() {
      this.render();
      get(this, 'tiObject').focus();

      return this;
    }
  };
  
  // SproutCore Wrapped Titanium Objects
  SCTi.Object = SC.Object.extend({
    tiObject: null,
    tiOptions: [],
    tiEvents: [],
    tiConstantMappings: {},
    
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

    getTiOptionValue: function(optionName) {
      var tiOptionName = optionName, translatedOptionName, splitOptionNames, val;
      
      if (optionName.indexOf(':') !== -1) {
        splitOptionNames = optionName.split(':');
        tiOptionName = splitOptionNames[0];
        translatedOptionName = splitOptionNames[1];
        val = get(this, translatedOptionName);
      } else {
        val = get(this, tiOptionName);
      }
      
      return val;      
    },
    
    forEachValidTiOption: function(callback) {
      var self = this, tiOptions = get(this, 'tiOptions');

      tiOptions.forEach(function(optionName) {
        var val = self.getTiOptionValue(optionName);
        
        if (val !== undefined && val !== null) {
          callback.call(this, optionName);
        }
      });

      return this;
    },
        
    optionsForTiObject: function() {
      var self = this, tiObjectOptions = {};
      
      this.forEachValidTiOption(function(optionName) {
        var optionVal = self.getTiOptionValue(optionName), tiOptionName = optionName;
        
        if (optionName.indexOf(':') !== -1) {
          tiOptionName = optionName.split(':')[0];
        }
        // Assign the Ti Object if the value is an SC wrapped Ti Object
        if (optionVal instanceof SCTi.Object) {
          optionVal.render();
          tiObjectOptions[tiOptionName] = get(optionVal, 'tiObject'); 
        } else {
          tiObjectOptions[tiOptionName] = optionVal;
        }
      });
      
      return tiObjectOptions;
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
    },
    
    unknownProperty: function(key, value) {
      var isConstant = /^.+Constant$/.test(key), propertyName, constantMap;
      
      if (isConstant) {
        propertyName = key.slice(0,-8);
        constantMap = get(this, 'tiConstantMappings')[propertyName];
        if (constantMap) {
          return constantMap[get(this, propertyName)];
        }
      }
    }
  });
  
  SCTi.View = SCTi.Object.extend(SCTi.Animatable, SCTi.Hideable, {
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
      
      this._super();

      for (var i = 0; i < childViews.length; i++) {
        var childView = childViews[i];
        childView.render();
        this.addChildView(tiObject, childView);
      }
      
      return this;
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
    tiOptions: 'autoLink backgroundPaddingBottom backgroundPaddingLeft backgroundPaddingRight backgroundPaddingTop color ellipsize font highlightedColor html minimumFontSize shadowColor shadowOffset text textAlign:textAlignConstant textid wordWrap'.w(),
    tiConstantMappings: {
      textAlign: {
        center: Ti.UI.TEXT_ALIGNMENT_CENTER,
        left: Ti.UI.TEXT_ALIGNMENT_LEFT,
        right: Ti.UI.TEXT_ALIGNMENT_RIGHT
      }
    },
    
    createTiObject: function(options) {
      return Ti.UI.createLabel(options);
    }
  });
  
  SCTi.TextField = SCTi.View.extend(SCTi.Focusable, {
    tiOptions: 'autocapitalization:autocapitalizationConstant borderStyle:borderStyleConstant clearButtonMode:clearButtonModeConstant clearOnEdit editable enabled hintText keyboardToolbar keyboardToolbarColor keyboardToolbarHeight keyboardType:keyboardTypeConstant leftButton leftButtonMode leftButtonPadding minimumFontSize paddingLeft paddingRight returnKeyType:returnKeyTypeConstant rightButton rightButtonMode rightButtonPadding suppressReturn value verticalAlign:verticalAlignConstant'.w(),
    tiEvents: 'change hasText return'.w(),
    tiConstantMappings: {
      autocapitalization: SCTi.AUTOCAPITALIZATION_CONSTANTS,
      borderStyle: {
        none: Ti.UI.INPUT_BORDERSTYLE_NONE,
        line: Ti.UI.INPUT_BORDERSTYLE_LINE,
        bezel: Ti.UI.INPUT_BORDERSTYLE_BEZEL,
        rounded: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      },
      clearButtonMode: {
        always: Ti.UI.INPUT_BUTTONMODE_ALWAYS,
        never: Ti.UI.INPUT_BUTTONMODE_NEVER,
        blur: Ti.UI.INPUT_BUTTONMODE_ONBLUR,
        focus: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
      },
      keyboardType: SCTi.KEYBOARD_TYPE_CONSTANTS,
      returnKeyType: SCTi.RETURNKEY_CONSTANTS,
      verticalAlign: {
        bottom: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
        center: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        top: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
      }
    },
    
    borderStyle: 'none',
    clearButtonMode: 'focus',
    
    createTiObject: function(options) {
      return Ti.UI.createTextField(options);
    },
    
    change: function() {
      var self = this, tiObject = get(this, 'tiObject');
      set(self, 'value', tiObject.value);
    }
  });
  
  SCTi.Button = SCTi.View.extend({
    tiOptions: 'color enabled font image selectedColor style:styleConstant title titleid'.w(),
    tiConstantMappings: {
      style: {
        bar: Titanium.UI.iPhone.SystemButtonStyle.BAR,
        bordered: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        done: Titanium.UI.iPhone.SystemButtonStyle.DONE,
        plain: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
      }
    },
    
    createTiObject: function(options) {
      return Ti.UI.createButton(options);
    }
  });
  
  SCTi.Tab = SCTi.View.extend({
    tiOptions: 'badge icon title window'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createTab(options);
    },
    
    open: function(scWindow) {
      this.render();
      scWindow.render();
      get(this, 'tiObject').open(get(scWindow, 'tiObject'));

      return this;
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

  SCTi.TextArea = SCTi.View.extend(SCTi.Focusable, {
    tiOptions: 'autoLink autocapitalization:autocapitalizationConstant editable enabled keyboardToolbar keyboardToolbarColor keyboardToolbarHeight returnKeyType:returnKeyTypeConstant suppressReturn value'.w(),
    tiEvents: 'change return selected'.w(),
    tiConstantMappings: {
      autocapitalization: SCTi.AUTOCAPITALIZATION_CONSTANTS,
      keyboardType: SCTi.KEYBOARD_TYPE_CONSTANTS,
      returnKeyType: SCTi.RETURNKEY_CONSTANTS 
    },
    
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
  
  SCTi.Animation = SCTi.View.extend({
    tiOptions: 'autoreverse color curve:curveConstant delay duration opaque repeat transition'.w(),
    tiEvents: 'complete start'.w(),
    tiConstantMappings: {
      curve: {
        easeIn: Ti.UI.ANIMATION_CURVE_EASE_IN,
        easeInOut: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
        easeOut: Ti.UI.ANIMATION_CURVE_EASE_OUT,
        linear: Ti.UI.ANIMATION_CURVE_LINEAR
      }
    },
    
    createTiObject: function(options) {
      return Ti.UI.createAnimation(options);
    }
  });
  
})();
