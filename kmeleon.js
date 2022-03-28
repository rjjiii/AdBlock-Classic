//
// XUL-based extensions put their code into standard JavaScript files.
// Refer to Mozilla's documentation for K-Meleon's engine's API.
// Refer to the K-Meleon wiki for K-Meleon interface APIs.
//
// K-Meleon specific features are handled by the jsBridge Kplugin.
//
//
// This extension will create a button on the toolbar and a menu item.
// Default toolbar: "Browser Con&figuration" (this is fine for most extensions)
// Menu: CloseWindow (choose a section that matches your extension)
// 
// 
// Create a "hello_world@extensions.kmeleonbrowser.org" string preference (in 
// about:config page) to override defaults.
// Simple KM macros can also change preferences to interact with xpi extensions.
//

var prefBranch = 'extensions.abprime.'
var ToolbarDefault = 'Browser Con&figuration';
var MenuDefault = 'CloseWindow';


var Toolbar = '';
var CmdName = 'AdBlock Classic ON/OFF';
var kmGUIfilters = "Settings";
var kmGUIlogs = "Save logs";
var kmGUIabout = "About";

//There are some jsBridge features that will not work on older versions of 
//K-Meleon. 74 is the oldest version with jsBridge. For the most part you can
//ignore version 74. This extension demonstrates though how to write for both
//the old KM74 and the current KM76.X.G branch.
var KMversion = 74;
var jsb = null;
var prefs = null;
var isOn = false;
var logsOn = false;
var Popup1Name = "Adblock-Classic";
var Popup1Item1 = 'Settings';
var Popup1Item2 = 'Save Logs';
var Popup1Item3 = 'About';

//===========================================//

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

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
  // setup Button
  jsb.RegisterCmd(CmdName, 'AdBlock Classic', function(wind, mode, arg) {
	isOn = MakeBoolPref('enabled', true);
	
	if (isOn){
		    prefs.setBoolPref('enabled', false);
			jsb.SetCmdIcon(CmdName, 'chrome://abprime/content/icon_off.png');
	}
	else{
		prefs.setBoolPref('enabled', true);
		jsb.SetCmdIcon(CmdName, 'chrome://abprime/content/icon_on.png');
	}

        

  }, 'chrome://abprime/content/icon.png');
  
    jsb.RegisterCmd(kmGUIfilters, 'Customize filter settings.', function(wind, mode, arg) {

    let watcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                            .getService(Components.interfaces.nsIWindowWatcher);

    watcher.openWindow(
      null,
      'chrome://abprime/content/filters.xul',
      'Screenshot settings',
      'chrome,titlebar,toolbar,centerscreen,modal,resizable',
      null
    );

// 


  });
  
    jsb.RegisterCmd(kmGUIlogs, 'Toggle data logging.', function(wind, mode, arg) {
	  
	logsOn = MakeBoolPref('savestats', true);
	if (logsOn){
		    prefs.setBoolPref('savestats', false);
			popupAlert('AdBlock Classic', 'Logging is enabled.');
	}
	else{
		prefs.setBoolPref('savestats', true);
		popupAlert('AdBlock Classic', 'Logging is disabled.');
	}

  });
  
    jsb.RegisterCmd(kmGUIabout, 'Display information, version number, and copyright for AdBlock Classic.', function(wind, mode, arg) {
	  
	              popupAlert('About', "AdBlock Classic is open-source software. You may use, modify, and redistribute it under the Mozilla Public License 2.0. Source code is available at the adblocker's download location. If you did not receive a copy of the license it is available online at: https://www.mozilla.org/en-US/MPL/2.0/ \n\nAdBlock Classic is a K-Meleon wrapper for ABPrime. ABPrime was built using code from the popular Adblock Plus. AdBlock Classic can use AdBlock Plus rules and subscriptions to block ads in K-Meleon. \n\nAdblock Plus is a registered trademark of eyeo GmbH. ABPrime is distributed by BinaryOutcast for various UXP-based applications. This third party package is not officially endorsed by K-Meleon. This software has been distributed freely and WITHOUT WARRANTY OF ANY KIND. \n\n\n\nVersion 2.0 \n\nCopyright \u00A9 2022 R.J.J. III");

  });


//syntax: addbutton("toolbar", "command-name", "menu", "tooltip");
// A blank "" results in K-Meleon default. The defaults are:
// menu: 	"Toolbars >
//			 [] Status Bar"
// tooltip: "command-name
//			 Right-click for more options."
jsb.AddButton(ToolbarDefault, CmdName, Popup1Name, "Block ads with AdBlock Classic.");
  
//syntax setmenu("menu", MENU_TYPE, "item-name", "command-name", <location>);
// for location: -1 adds the last item on a list, other integers order a list,
// 				 strings position an item adjacent to another item.
// Note: all items are not required to build menu entries, but all items must be
//		 present to display icons.
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, Popup1Item1, kmGUIfilters, 0);
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, Popup1Item2, kmGUIlogs, 1);
jsb.SetMenu(Popup1Name, jsb.MENU_COMMAND, Popup1Item3, kmGUIabout, 2);

}
if(KMversion<75){
}

};

function MakeBoolPref(name, def) {
  if(prefs.getPrefType(name) == prefs.PREF_BOOL) {
    return( prefs.getBoolPref(name) );
  } else {
    prefs.setBoolPref(name, def);
    return( def );
  }
};

function MakeBoolPref(name, def) {
  if(prefs.getPrefType(name) == prefs.PREF_BOOL) {
    return( prefs.getBoolPref(name) );
  } else {
    prefs.setBoolPref(name, def);
    return( def );
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