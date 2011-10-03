(function() {
  Ti.include('/tests/lib/jasmine-1.0.2.js');
  Ti.include('/tests/lib/jasmine-titanium.js');
  
  describe("SCTi", function() {
    it("namespace should be defined", function() {
      expect(SCTi).toBeDefined();
    });
  
    
    
    
  });
  
  Ti.include('/tests/view_test.js');
  Ti.include('/tests/simple_views_test.js');
  Ti.include('/tests/mixins.js');
    
  jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
  jasmine.getEnv().execute();
})();
