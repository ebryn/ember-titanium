(function() {
  describe("SCTi.Animatable", function() {
    it("should be defined", function() {
      expect(SCTi.Animatable).toBeDefined();
    });
    
    it("should animate", function() {
      var view = SCTi.Object.create(SCTi.Animatable),
          animation = SCTi.Animation.create(),
          wasCalled = false;
          
      view.set('tiObject', {
        animate: function(animation) { wasCalled = true; }
      });
      
      view.animate(animation);
      expect(wasCalled).toEqual(true);
    });
  });
  
  describe("SCTi.Openable", function() {
    it("should be defined", function() {
      expect(SCTi.Openable).toBeDefined();
    });
    
    it("should be openable", function() {
      var view = SCTi.Object.create(SCTi.Openable), wasCalled = false;
      
      view.set('tiObject', {
        open: function() { wasCalled = true; }
      });
      
      view.open();
      expect(wasCalled).toEqual(true);
    });
    
    it("should be closable", function() {
      var view = SCTi.Object.create(SCTi.Openable), wasCalled = false;
      
      view.set('tiObject', {
        close: function() { wasCalled = true; }
      });
      
      view.close();
      expect(wasCalled).toEqual(true);
    });
  });
  
  describe("SCTi.Hideable", function() {
    it("should be defined", function() {
      expect(SCTi.Hideable).toBeDefined();
    });
    
    it("should be hideable", function() {
      var view = SCTi.Object.create(SCTi.Hideable), wasCalled = false;
      
      view.set('tiObject', {
        hide: function() { wasCalled = true; }
      });
      
      view.hide();
      expect(wasCalled).toEqual(true);
    });
    
    it("should be showable", function() {
      var view = SCTi.Object.create(SCTi.Hideable), wasCalled = false;
      
      view.set('tiObject', {
        show: function() { wasCalled = true; }
      });
      
      view.show();
      expect(wasCalled).toEqual(true);
    });
  });
  
  describe("SCTi.Focusable", function() {
    it("should be defined", function() {
      expect(SCTi.Focusable).toBeDefined();
    });
    
    it("should respond to blur", function() {
      var view = SCTi.Object.create(SCTi.Focusable),
          wasCalled = false;

      view.set('tiObject', {
        blur: function() { wasCalled = true; }
      });

      view.blur();
      expect(wasCalled).toEqual(true);
    });

    it("should respond to focus", function() {
      var view = SCTi.Object.create(SCTi.Focusable),
          wasCalled = false;

      view.set('tiObject', {
        focus: function() { wasCalled = true; }
      });

      view.focus();
      expect(wasCalled).toEqual(true);
    });
  });
})();
