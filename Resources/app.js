var window = this;
Ti.include('/lib/sc_ti.js');

var RUN_TESTS = true;

if (RUN_TESTS) {
  Ti.include('/tests/tests.js');
} else {
  // this sets the background color of the master UIView (when there are no windows/tab groups on it)
  Titanium.UI.setBackgroundColor('#000');

  // create tab group
  var tabGroup = SCTi.TabGroup.create({
    opened: function() {
      var alertDialog = SCTi.AlertDialog.create({
        title: 'Hello',
        message: 'SproutCore Rocks!',
        buttonNames: ['OK', 'Cancel']
      });
      alertDialog.show();
    }
  });

  // create base UI tab and root window
  var win1 = SCTi.Window.create({
      title:'Tab 1',
      backgroundColor:'#fff'
  });
  var tab1 = SCTi.Tab.create({
      icon:'KS_nav_views.png',
      title:'Tab 1',
      window:win1
  });

  var label1 = SCTi.Label.create({
  	color:'#999',
  	text:'I am Window 1',
  	font:{fontSize:20,fontFamily:'Helvetica Neue'},
  	textAlign:'center',
  	width:'auto'
  });

  win1.add(label1);
  
  var image = SCTi.ImageView.create({
    image: 'KS_nav_views.png',
    height: 43,
    width: 46,
    top: 10
  });
  
  win1.add(image);
  
  var textarea = SCTi.TextArea.create({
    top: 60,
    height: 50,
    width: 200,
    value: 'I am a SCTi.TextArea'
  });
  
  win1.add(textarea);

  // create controls tab and root window
  var win2 = SCTi.Window.create({
      title:'Tab 2',
      backgroundColor:'#fff'
  });
  var tab2 = SCTi.Tab.create({
      icon:'KS_nav_ui.png',
      title:'Tab 2',
      window:win2
  });

  var label2 = SCTi.Label.create({
  	color:'#999',
  	text:'I am Window 2',
  	font:{fontSize:20,fontFamily:'Helvetica Neue'},
  	textAlign:'center',
  	width:'auto'
  });

  win2.add(label2);
  
  var animation = SCTi.Animation.create({
    duration: 2000,
    opacity: 0
  });
  
  image.animate(animation);

  //  add tabs
  tabGroup.add(tab1);
  tabGroup.add(tab2);

  // open tab group
  tabGroup.open();
}
