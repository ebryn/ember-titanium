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
    
    it("should be closable", function() {
      var view = SCTi.Window.create();
      expect(function() { view.close(); }).not.toThrow();
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
  
  describe("SCTi.Tab", function() {
    it("should be defined", function() {
      expect(SCTi.Tab).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Tab", function() {
      var view = SCTi.Tab.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
  });
  
  describe("SCTi.TabGroup", function() {
    it("should be defined", function() {
      expect(SCTi.TabGroup).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.TabGroup", function() {
      var view = SCTi.TabGroup.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
    
    it("should be able to add tabs", function() {
      var view = SCTi.TabGroup.create();
      
      expect(view.childViews.length).toEqual(0);
    
      view.add(SCTi.Tab.create());
      expect(view.childViews.length).toEqual(1);
    });
    
    it("should be able to set the active tab", function() {
      var view = SCTi.TabGroup.create();
      expect(function() { view.setActiveTab(0); }).not.toThrow();
    });
    
    it("should render tabs when displayed", function() {
      var view = SCTi.TabGroup.create({
        childViews: [
          SCTi.Tab.create()
        ]
      });
      
      expect(view.childViews.length).toEqual(1);
    
      var fakeTiView = {
        addTab: function() {}
      };
      view.set('tiView', fakeTiView);
      spyOn(fakeTiView, 'addTab');
      
      view.render();
      
      expect(fakeTiView.addTab).toHaveBeenCalled();
      expect(fakeTiView.addTab.callCount).toEqual(1);
    });
  });
  
  describe("SCTi.ImageView", function() {
    it("should be defined", function() {
      expect(SCTi.ImageView).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.ImageView", function() {
      var view = SCTi.ImageView.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
  });
  
})();
