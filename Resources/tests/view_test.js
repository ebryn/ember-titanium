(function() {
  describe("SCTi.View", function() {
    it("should be defined", function() {
      expect(SCTi.View).toBeDefined();
    });
  
    it("should be able to create a Ti.UI.View", function() {
      var view = SCTi.View.create(), tiObject;
      
      tiObject = view.createObject();
      
      expect(tiObject).toBeDefined();
    });
    
    it("should only create a Ti.UI.View once", function() {
      var view = SCTi.View.create(), tiObject1, tiObject2;
      
      tiObject1 = view.createObject();
      tiObject2 = view.createObject();
      
      expect(tiObject1).toEqual(tiObject2);
    });
    
    it("should store the Titanium view in the tiObject property", function() {
      var view = SCTi.View.create(), tiObject;
      view.createObject();
      tiObject = view.get('tiObject');
      expect(tiObject).toBeDefined();
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

      var fakeTiObject = {
        add: function() {}
      };
      view.set('tiObject', fakeTiObject);
      spyOn(fakeTiObject, 'add');
      
      view.render();
      
      expect(fakeTiObject.add).toHaveBeenCalled();
      expect(fakeTiObject.add.callCount).toEqual(1);
    });
    
    it("should be able to add childViews after render", function() {
      var view = SCTi.View.create(),
          childView = SCTi.View.create();
      
      view.render();

      view.add(childView);
      
      expect(childView.get('tiObject')).toNotEqual(null);
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
      
      expect(view.optionsForTiObject().backgroundColor).toEqual('white');
    });
    
    it("should register event listeners", function() {
      var view = SCTi.Object.create({
        tiEvents: 'click'.w(),
        click: function() {}
      });
      
      var fakeTiObject = {
        addEventListener: function() {}
      };
      view.set('tiObject', fakeTiObject);
      spyOn(fakeTiObject, 'addEventListener');
      
      view.render();
      
      expect(fakeTiObject.addEventListener).toHaveBeenCalled();
      expect(fakeTiObject.addEventListener.callCount).toEqual(1);
    });
    
    it("should register renamed event listeners", function() {
      var openedWasCalled = false, view = SCTi.Object.create({
        tiEvents: 'open:opened',
        opened: function() { openedWasCalled = true; }
      });
      
      var fakeTiObject = {
        addEventListener: function() {}
      };
      view.set('tiObject', fakeTiObject);
      spyOn(fakeTiObject, 'addEventListener');
      
      view.render();

      expect(fakeTiObject.addEventListener).toHaveBeenCalled();
      expect(fakeTiObject.addEventListener.callCount).toEqual(1);
      expect(fakeTiObject.addEventListener.mostRecentCall.args[0]).toEqual('open');

      fakeTiObject.addEventListener.mostRecentCall.args[1].call();
      expect(openedWasCalled).toEqual(true);
    });

    it("should register observers", function() {
      var view = SCTi.View.create({
        width: 100
      });
      
      var tiObject = view.createObject();
      expect(tiObject.width).toEqual(100);

      view.set("width", 200);

      SC.run(function() {
        expect(tiObject.width).toEqual(200);
      });
    });

    it("should translate constants", function() {
      var constantValue = 123, MyObject = SCTi.Object.extend({
        tiOptions: "borderStyle:borderStyleConstant",
        tiConstantMappings: {
          borderStyle: {
            line: constantValue
          }
        }
      }), obj = MyObject.create({borderStyle: 'line'});
      
      expect(obj.get('borderStyleConstant')).toEqual(constantValue);
      expect(obj.optionsForTiObject()['borderStyle']).toEqual(constantValue);
    });
    
    it("should passthrough constants", function() {
      var constantValue = 123, MyObject = SCTi.Object.extend({
        tiOptions: "borderStyle:borderStyleConstant"
      }), obj = MyObject.create({borderStyle: constantValue});
      
      expect(obj.get('borderStyleConstant')).toEqual(constantValue);
      expect(obj.optionsForTiObject()['borderStyle']).toEqual(constantValue);
    });
    
    it("should apply any property changes after tiObject is created", function() {
      var TestObject = SCTi.Object.extend({
        tiOptions: "first second".w(),
        createTiObject: function(options) {
          return options;
        }
      });

      var obj = TestObject.create({first: "OHAI"}),
          tiObject = obj.createObject();
      expect(tiObject.first).toEqual("OHAI");
      expect(tiObject.second).toBeUndefined();

      obj.set('second', "THERE");
      expect(tiObject.second).toEqual("THERE");
    });

  });
})();
