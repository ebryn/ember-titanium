var window = this;
Ti.include('/lib/sc_ti.js');

var RUN_TESTS = true;

if (RUN_TESTS) {
  Ti.include('/tests/tests.js');
} else {
  var appWindow = SCTi.Window.create();
  
  var appView = SCTi.View.create({
    backgroundColor: 'white',
    top: 0, left: 0
  });
  
  appView.add(
    SCTi.Label.create({
      text: "I'm a SCTi.Label",
      top: 0, left: 0, height: 40
    })
  );
  
  appView.add(
    SCTi.TextField.create({
      value: "I'm a SCTi.TextField",
      top: 40, left: 0, height: 40
    })
  );
  
  appView.add(
    SCTi.Button.create({
      title: "I'm a SCTi.Button",
      top: 80, left: 0, height: 40
    })
  );
  
  appWindow.add(appView);
  
  appWindow.open();
}
