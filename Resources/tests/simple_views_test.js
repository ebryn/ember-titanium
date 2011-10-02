(function() {
  describe("SCTi.Window", function() {
    it("should be defined", function() {
      expect(SCTi.Window).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Window", function() {
      var view = SCTi.Window.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
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
      var view = SCTi.Label.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
    });
  });
  
  describe("SCTi.TextField", function() {
    it("should be defined", function() {
      expect(SCTi.TextField).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.TextField", function() {
      var view = SCTi.TextField.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
    });
  });
  
  describe("SCTi.Button", function() {
    it("should be defined", function() {
      expect(SCTi.Button).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Button", function() {
      var view = SCTi.Button.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
    });
  });
  
  describe("SCTi.Tab", function() {
    it("should be defined", function() {
      expect(SCTi.Tab).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.Tab", function() {
      var view = SCTi.Tab.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
    });
  });
  
  describe("SCTi.TabGroup", function() {
    it("should be defined", function() {
      expect(SCTi.TabGroup).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.TabGroup", function() {
      var view = SCTi.TabGroup.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
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
    
      var fakeTiObject = {
        addTab: function() {}
      };
      view.set('tiObject', fakeTiObject);
      spyOn(fakeTiObject, 'addTab');
      
      view.render();
      
      expect(fakeTiObject.addTab).toHaveBeenCalled();
      expect(fakeTiObject.addTab.callCount).toEqual(1);
    });
  });
  
  describe("SCTi.ImageView", function() {
    it("should be defined", function() {
      expect(SCTi.ImageView).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.ImageView", function() {
      var view = SCTi.ImageView.create(), tiView;
      
      tiView = view.createObject();
      
      expect(tiView).toBeDefined();
    });
  });
  
  describe("SCTi.TextArea", function() {
    it("should be defined", function() {
      expect(SCTi.TextArea).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.TextArea", function() {
      var view = SCTi.TextArea.create(), tiView;
      
      tiView = view.createObject();
      
      expect(tiView).toBeDefined();
    });
  });
  
  describe("SCTi.AlertDialog", function() {
    it("should be defined", function() {
      expect(SCTi.AlertDialog).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.AlertDialog", function() {
      var view = SCTi.AlertDialog.create(), tiView;
      
      tiView = view.createObject();
      
      expect(tiView).toBeDefined();
    });
  });
  
})();
