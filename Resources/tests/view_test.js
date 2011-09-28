(function() {
  describe("SCTi.View", function() {
    it("should be defined", function() {
      expect(SCTi.View).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.View", function() {
      var view = SCTi.View.create(), tiView;
      
      tiView = view.createView();
      
      expect(tiView).toBeDefined();
    });
    
    it("should only create a Ti.UI.View once", function() {
      var view = SCTi.View.create(), tiView1, tiView2;
      
      tiView1 = view.createView();
      tiView2 = view.createView();
      
      expect(tiView1).toEqual(tiView2);
    });
    
    it("should store the Titanium view in the tiView property", function() {
      var view = SCTi.View.create(), tiView;
      view.createView();
      tiView = view.get('tiView');
      expect(tiView).toBeDefined();
    });
    
    it("should be able to add childViews", function() {
      var view = SCTi.View.create();
      
      expect(view.childViews.length).toEqual(0);
    
      view.add(SCTi.View.create());
      expect(view.childViews.length).toEqual(1);
    });

    it("should render childViews when displayed", function() {
      var view = SCTi.View.create({
        childViews: [
          SCTi.View.create()
        ]
      });
      
      expect(view.childViews.length).toEqual(1);

      var fakeTiView = {
        add: function() {}
      };
      view.set('tiView', fakeTiView);
      spyOn(fakeTiView, 'add');
      
      view.render();
      
      expect(fakeTiView.add).toHaveBeenCalled();
      expect(fakeTiView.add.callCount).toEqual(1);
    });
    
    it("should sync bindings before display", function() {
      var view = SCTi.View.create({
        content: SC.Object.create({value: "OHAI"}),
        valueBinding: "content.value"
      });
      
      expect(view.get('value')).toBeUndefined();
      
      view.render();
      
      expect(view.get('value')).toEqual("OHAI");
    });
    
    it("should pass along tiOptions", function() {
      var view = SCTi.View.create({
        backgroundColor: 'white'
      });
      
      expect(view.optionsForTiView().backgroundColor).toEqual('white');
    });
    
    it("should register event listeners", function() {
      var view = SCTi.View.create({
        click: function() {}
      });
      
      var fakeTiView = {
        add: function() {},
        addEventListener: function() {}
      };
      view.set('tiView', fakeTiView);
      spyOn(fakeTiView, 'addEventListener');
      
      view.render();
      
      expect(fakeTiView.addEventListener).toHaveBeenCalled();
      expect(fakeTiView.addEventListener.callCount).toEqual(1);
    });
  });

  
})();
