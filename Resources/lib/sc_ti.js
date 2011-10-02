var window = this;
Ti.include('/lib/sproutcore-runtime.js');
console.log = console.info = console.warn = console.error = Ti.API.info;

var queues = SC.run.queues;
queues.insertAt(queues.indexOf('actions')+1, 'render');

(function() {
  var get = SC.get, set = SC.set;
  
  SCTi = {};
  
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
        tiObjectOptions[optionName] = get(self, optionName);
      });
      
      return tiObjectOptions;
    },
    
    registerEvents: function() {
      var self = this, tiObject = get(this, 'tiObject'), tiEvents = get(this, 'tiEvents');
      tiEvents.forEach(function(eventName) {
        var handler = get(self, eventName);
        if (handler && typeof handler === 'function') {
          tiObject.addEventListener(eventName, function(event) { handler.call(self, event); });
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
  
  SCTi.View = SCTi.Object.extend({
    tiOptions: 'backgroundColor font width height top bottom left right layout'.w(),
    
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

      for (var i = 0; i < childViews.length; i++) {
        var childView = childViews[i];
        childView.render();
        this.addChildView(tiObject, childView);
      }
      
      return this._super();
    }
  });
  
  SCTi.Window = SCTi.View.extend({
    tiOptions: 'title'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createWindow(options);
    },
    
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
  });
  
  SCTi.Label = SCTi.View.extend({
    tiOptions: 'color text textAlign'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createLabel(options);
    }
  });
  
  SCTi.TextField = SCTi.View.extend({
    tiOptions: 'color value borderStyle'.w(),
    tiEvents: 'focus blur change'.w(),
    
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
    tiOptions: 'title'.w(),
    tiEvents: 'click'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createButton(options);
    }
  });
  
  SCTi.Tab = SCTi.View.extend({
    tiOptions: 'icon title'.w(),
    
    createTiObject: function(options) {
      return Ti.UI.createTab(options);
    },
    
    optionsForTiObject: function() {
      var tiObjectOptions = this._super();
      
      var sctiWindow = get(this, 'window');
      if (sctiWindow !== undefined && sctiWindow !== null) {
        sctiWindow.render();
        tiObjectOptions['window'] = get(sctiWindow, 'tiObject');
      }
      
      return tiObjectOptions;
    }
    
  });
  
  SCTi.TabGroup = SCTi.Window.extend({
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
  
})();
