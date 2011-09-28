(function() {
  describe("SCTi.Window", function() {
    it("should be defined", function() {
      expect(SCTi.Window).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Window", function() {
      var view = SCTi.Window.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });

    it("should be openable", function() {
      var view = SCTi.Window.create();
      expect(function() { view.open(); }).not.toThrow();
    });
  });

  describe("SCTi.Label", function() {
    it("should be defined", function() {
      expect(SCTi.Label).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Label", function() {
      var view = SCTi.Label.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
  });
  
  describe("SCTi.TextField", function() {
    it("should be defined", function() {
      expect(SCTi.TextField).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.TextField", function() {
      var view = SCTi.TextField.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
  });
  
  describe("SCTi.Button", function() {
    it("should be defined", function() {
      expect(SCTi.Button).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Button", function() {
      var view = SCTi.Button.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
  });
  
})();
