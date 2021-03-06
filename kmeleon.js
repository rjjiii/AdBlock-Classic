// AdBlock Classic
// This file contains K-Meleon-specific gui code.
//===========================================//

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

//Localization:
var gmyextensionBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var _bundle = gmyextensionBundle.createBundle("chrome://abprime/locale/abprime.properties");

var prefBranch = 'extensions.abprime.'

//Toolbar button near the "Settings" icon:
var ToolbarDefault = 'Browser Con&figuration';
var Toolbar = '';
var CmdName = 'Toggle AdBlock Classic';
var MenuDefault = '&Tools';


//KM74 cannot use most of JSBridge's functions:
var KMversion = 74;
var jsb = null;
var prefs = null;
var isOn = false;
var logsOn = false;
var Popup1Name = "Adblock-Classic";




var timer = Components.classes["@mozilla.org/timer;1"]
             .createInstance(Components.interfaces.nsITimer); 

var active = false;




//===========================================//


//===========================================//

function startup(data, reason) {

  if(active) { return };
  active = true;

  delayed_startup();

};

//===========================================//

function delayed_startup() { 

  // trying to get the JSBridge pointer
  //  and wait for the JSBridge to be ready (occurs when the browser starts)
  jsb = null;
  try {
    jsb = Components.classes["@kmeleon/jsbridge;1"].getService(Components.interfaces.nsIJSBridge);
  } catch(e) { };

  if(jsb==null) {
    timer.initWithCallback(delayed_startup, 300, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
    return;
  };
  
  //KM version? TODO: understand
KMversion = ((jsb.RegisterCmd && jsb.AddButton) ? 75 : 74);


  // get prefs
  // getPrefType : PREF_INVALID, PREF_STRING, PREF_INT, PREF_BOOL 
  // getCharPref, getIntPref, getBoolPref, getPrefType, resetBranch('')
  prefs = Components.classes["@mozilla.org/preferences-service;1"]
              .getService(Components.interfaces.nsIPrefService).getBranch(prefBranch);
  Toolbar = (prefs.getPrefType("toolbar") == prefs.PREF_STRING) ?
     prefs.getCharPref("toolbar") : ToolbarDefault;

if(KMversion>=75)
{
	
  //Toolbar Button Actions
  jsb.RegisterCmd(CmdName, _bundle.GetStringFromName("km_toggle_status"), function(wind, mode, arg) {
	ToggleButton();
  }, 'chrome://abprime/content/icon.png');
  //Check state to see if button is off:

 
//Menu options pull text from locale:
    jsb.RegisterCmd(_bundle.GetStringFromName("km_settings"), _bundle.GetStringFromName("km_status_settings"), function(wind, mode, arg) {

    let watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                            .getService(Components.interfaces.nsIWindowWatcher);

    watcher.openWindow(
      null,
      'chrome://abprime/content/filters.xul',
      'Filter settings',
      'chrome,titlebar,toolbar,centerscreen,modal,resizable',
      null
    );

// 


  });
  
    jsb.RegisterCmd(_bundle.GetStringFromName("km_logs"), _bundle.GetStringFromName("km_status_log"), function(wind, mode, arg) {
	//This should use checkmarks, but I'm not sure the best way, so I'm using alerts on change: 
	logsOn = MakeBoolPref('savestats', true);
	if (logsOn){
		    prefs.setBoolPref('savestats', false);
			popupAlert('AdBlock Classic', _bundle.GetStringFromName("km_alert_on"));
	}
	else{
		prefs.setBoolPref('savestats', true);
		popupAlert('AdBlock Classic', _bundle.GetStringFromName("km_alert_off"));
	}

  });
  
    jsb.RegisterCmd(_bundle.GetStringFromName("km_about"), _bundle.GetStringFromName("km_status_about"), function(wind, mode, arg) {

    jsb.Open("chrome://abprime/content/about.html", jsb.OPEN_NEWTAB);

// 


  });

//Create Toolbar Button
//syntax: addbutton("toolbar", "command-name", "menu", "tooltip");
jsb.AddButton(ToolbarDefault, CmdName, Popup1Name, _bundle.GetStringFromName("km_tip"));

//Create Toolbar Menu
//syntax setmenu("menu", MENU_TYPE, "item-name", "command-name", <location>);
jsb.SetMenu(MenuDefault, jsb.MENU_POPUP, Popup1Name, "", 0);
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_toggle"), CmdName, 0);
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_settings"), _bundle.GetStringFromName("km_settings"), 1);
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_logs"), _bundle.GetStringFromName("km_logs"), 2);
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_about"), _bundle.GetStringFromName("km_about"), 3);

}
if(KMversion<75){
//KM74 code goes here.
}
  	WhatColorForButton();
};


function MakeBoolPref(name, def) {
  if(prefs.getPrefType(name) == prefs.PREF_BOOL) {
    return( prefs.getBoolPref(name) );
  } else {
    prefs.setBoolPref(name, def);
    return( def );
  }
};


function WhatColorForButton(){
	isOn = prefs.getBoolPref('enabled', false);
	
	if (isOn){
		jsb.SetCmdIcon(CmdName, 'chrome://abprime/content/icon_on.png');
		jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_toggle"), CmdName, 0);
	}
	else{
		jsb.SetCmdIcon(CmdName, 'chrome://abprime/content/icon_off.png');
		jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_toggle_off"), CmdName, 0);
	}
};

function ToggleButton(){
		isOn = MakeBoolPref('enabled', true);
	
	if (isOn){
		    prefs.setBoolPref('enabled', false);
			jsb.SetCmdIcon(CmdName, 'chrome://abprime/content/icon_off.png');
			jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_toggle_off"), CmdName, 0);
			jsb.RebuildMenu(Popup1Name);
	}
	else{
		prefs.setBoolPref('enabled', true);
		jsb.SetCmdIcon(CmdName, 'chrome://abprime/content/icon_on.png');
		jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, _bundle.GetStringFromName("km_toggle"), CmdName, 0);
		jsb.RebuildMenu(Popup1Name);
	}
};
//===========================================//
 
function shutdown(data, reason) {

  if(!active) { return };
  active = false;

  // remove button and Command
  try { jsb.RemoveButton(Toolbar, CmdName); } catch(e) { };
  try { jsb.UnregisterCmd(CmdName); } catch(e) { };

};

//===========================================//

function install(data, reason) {
}


function uninstall(data, reason) {
}

//===========================================//

function popupAlert(title, msg) {

  Services.prompt.alert(null, title, msg);
}

//===========================================//