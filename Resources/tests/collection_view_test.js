// These test case names are stolen from SC2's CollectionView tests.

(function() {
  describe("SCTi.CollectionView", function() {
    it("should be defined", function() {
      expect(SCTi.CollectionView).toBeDefined();
    });
  
    it("should render a view for each item in its content array", function() {
      var view = SCTi.CollectionView.create({
        content: [1, 2, 3, 4]
      });
    
      // SC.run(function() {
        // view.render();
      // });
      
      expect(view.getPath('childViews.length')).toEqual(4);
    });
    
    // "should render the emptyView if content array is empty (view class)"
    // "should render the emptyView if content array is empty (view instance)"
    // "should allow custom item views by setting itemViewClass"
    
    it("should insert a new item in the view hierarchy when an item is added to the content array", function() {
      var content = ['a', 'c', 'd'];
      
      var view = SCTi.CollectionView.create({
        content: content
      });
      
      content.insertAt(1, 'b');
      expect(view.getPath('childViews.length')).toEqual(4);
    });
    
    it("should remove an item from the view hierarchy when an item is removed from the content array", function() {
      var content = ['a', 'b', 'c'];
      
      var view = SCTi.CollectionView.create({
        content: content
      });
      
      expect(view.getPath('childViews.length')).toEqual(3);
      
      content.removeAt(1);
      expect(view.getPath('childViews.length')).toEqual(2);
    });
    
    // "should allow changes to content object before layer is created"
    
    it("should allow changing content property to be null", function() {
      var content = ['a', 'b', 'c'];
      
      var view = SCTi.CollectionView.create({
        content: content
      });
      
      expect(view.getPath('childViews.length')).toEqual(3);
      
      view.set('content', null);
      expect(view.getPath('childViews.length')).toEqual(0);
    });
    
    // "should allow items to access to the CollectionView's current index in the content array"
    
  });
  
})();
