var window = this;
Ti.include('/lib/sproutcore-runtime.js');
console.log = console.info = console.warn = console.error = Ti.API.info;

var queues = SC.run.queues;
queues.insertAt(queues.indexOf('actions')+1, 'render');

(function() {
  var get = SC.get, set = SC.set;
  
  SCTi = {};
  
  SCTi.View = SC.Object.extend({
    tiView: null,
    tiOptions: 'backgroundColor font width height top bottom left right layout'.w(),
    tiEvents: [],
    
    concatenatedProperties: ['tiOptions', 'tiEvents'],
    
    childViews: [],
    
    init: function() {
      this._super();
      
      // Use slice to create copies of the following arrays.
      var childViews = get(this, 'childViews').slice(),
          tiOptions = get(this, 'tiOptions').slice(),
          tiEvents = get(this, 'tiEvents').slice();

      set(this, 'childViews', childViews);
      set(this, 'tiOptions', tiOptions);
      set(this, 'tiEvents', tiEvents);
    },
    
    createTiView: function(options) {
      return Ti.UI.createView(options);
    },
    
    createView: function() {
      var tiView = get(this, 'tiView');
      
      if (!tiView) {
        var tiView = this.createTiView(this.optionsForTiView());
        set(this, 'tiView', tiView);
        this.createObservers();
      }
       
      return tiView;
    },
    
    add: function(view) {
      var childViews = get(this, 'childViews');
      childViews.push(view);
      return this;
    },
    
    addChildView: function(tiView, childView) {
      tiView.add(get(childView, 'tiView'));
    },
    
    render: function() {
      var tiView = this.createView(), childViews = get(this, 'childViews');
      
      if (get(this, 'isRendered')) { return this; }
      
      SC.run.sync(); // FIXME: is this okay?
      
      this.registerEvents();
      
      for (var i = 0; i < childViews.length; i++) {
        var childView = childViews[i];
        childView.render();
        this.addChildView(tiView, childView);
      }
      
      set(this, 'isRendered', true);
      
      return this;
    },
    
    optionsForTiView: function() {
      var self = this, tiViewOptions = {};
      
      this.forEachValidTiOption(function(optionName) {
        tiViewOptions[optionName] = get(self, optionName);
      });
      
      return tiViewOptions;
    },
    
    registerEvents: function() {
      var self = this, tiView = get(this, 'tiView'), tiEvents = get(this, 'tiEvents');
      tiEvents.forEach(function(eventName) {
        var handler = get(self, eventName);
        if (handler && typeof handler === 'function') {
          tiView.addEventListener(eventName, function(event) { handler.call(self, event); });
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
          var tiView = get(this, 'tiView');
          var currentValue = tiView[optionName], newValue = get(this, optionName);

          if (newValue !== currentValue) {
            tiView[optionName] = newValue;
          }
        };

        SC.addObserver(self, optionName, observer);
      });
    }
  });
  
  SCTi.Window = SCTi.View.extend({
    tiOptions: 'title'.w(),
    
    createTiView: function(options) {
      return Ti.UI.createWindow(options);
    },
    
    open: function() {
      this.render();
      get(this, 'tiView').open();
      
      return this;
    },
    
    close: function(options) {
      this.render();
      get(this, 'tiView').close(options);
      
      return this;
    }
  });
  
  SCTi.Label = SCTi.View.extend({
    tiOptions: 'color text textAlign'.w(),
    
    createTiView: function(options) {
      return Ti.UI.createLabel(options);
    }
  });
  
  SCTi.TextField = SCTi.View.extend({
    tiOptions: 'color value'.w(),
    tiEvents: 'focus blur change'.w(),
    
    createTiView: function(options) {
      options.borderStyle = options.borderStyle || Ti.UI.INPUT_BORDERSTYLE_NONE;
      return Ti.UI.createTextField(options);
    },

    change: function() {
      var self = this, tiView = get(this, 'tiView');
      set(self, 'value', tiView.value);
    }
  });
  
  SCTi.Button = SCTi.View.extend({
    tiOptions: 'title'.w(),
    tiEvents: 'click'.w(),
    
    createTiView: function(options) {
      return Ti.UI.createButton(options);
    }
  });
  
  SCTi.Tab = SCTi.View.extend({
    tiOptions: 'icon title'.w(),
    
    createTiView: function(options) {
      return Ti.UI.createTab(options);
    },
    
    optionsForTiView: function() {
      var tiViewOptions = this._super();
      
      var sctiWindow = get(this, 'window');
      if (sctiWindow !== undefined && sctiWindow !== null) {
        sctiWindow.render();
        tiViewOptions['window'] = get(sctiWindow, 'tiView');
      }
      
      return tiViewOptions;
    }
    
  });
  
  SCTi.TabGroup = SCTi.Window.extend({
    addChildView: function(tiView, childView) {
      tiView.addTab(get(childView, 'tiView'));
    },

    createTiView: function(options) {
      return Ti.UI.createTabGroup(options);
    },
    
    setActiveTab: function(tabIndex) {
      this.render();
      get(this, 'tiView').setActiveTab(tabIndex);
      
      return this;
    }
  });
  
})();
