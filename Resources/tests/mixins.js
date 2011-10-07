(function() {
  describe("SCTi.Animatable", function() {
    it("should be defined", function() {
      expect(SCTi.Animatable).toBeDefined();
    });
    
    it("should animate", function() {
      var view = SCTi.Object.create(SCTi.Animatable),
          animation = SCTi.Animation.create();
          
      var fakeTiObject = {
        animate: function(animation) {}
      };
      view.set('tiObject', fakeTiObject);
      
      expect(function() { view.animate(animation); }).not.toThrow();
    });
  });
  
  describe("SCTi.Openable", function() {
    it("should be defined", function() {
      expect(SCTi.Openable).toBeDefined();
    });
    
    it("should be openable", function() {
      var view = SCTi.Object.create(SCTi.Openable);
      
      var fakeTiObject = {
        open: function() {}
      };
      view.set('tiObject', fakeTiObject);
      
      expect(function() { view.open(); }).not.toThrow();
    });
    
    it("should be closable", function() {
      var view = SCTi.Object.create(SCTi.Openable);
      
      var fakeTiObject = {
        close: function() {}
      };
      view.set('tiObject', fakeTiObject);
      
      expect(function() { view.close(); }).not.toThrow();
    });
  });
  
  describe("SCTi.Hideable", function() {
    it("should be defined", function() {
      expect(SCTi.Hideable).toBeDefined();
    });
    
    it("should be hideable", function() {
      var view = SCTi.Object.create(SCTi.Hideable);
      
      var fakeTiObject = {
        hide: function() {}
      };
      view.set('tiObject', fakeTiObject);
      
      expect(function() { view.hide(); }).not.toThrow();
    });
    
    it("should be showable", function() {
      var view = SCTi.Object.create(SCTi.Hideable);
      
      var fakeTiObject = {
        show: function() {}
      };
      view.set('tiObject', fakeTiObject);
      
      expect(function() { view.show(); }).not.toThrow();
    });
  });
})();
