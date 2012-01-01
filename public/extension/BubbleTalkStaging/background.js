/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://docs.crossrider.com/#!/guide/background_scope
*************************************************************************************/


// Place your code here (ideal for handling browser button, global timers, etc.)
//appAPI.ready(function() {
	
	// Sets the resource path for the popup
   // appAPI.browserAction.setPopup({
     //   resourcePath:'html/popUp.html',
       // height: 300,
        //width: 300
    //});
	
	/*// Global variable to hold the toggle state of the button
	var buttonState = true;
	
	// Sets the initial onClick event handler for the button
	appAPI.browserAction.onClick(function(){
		if (buttonState) {
			appAPI.message.toActiveTab({type: "tab", action: "CreateToolbar"});
		}
		else {
			appAPI.message.toActiveTab({type: "tab", action: "RemoveToolbar"});
		}
		
		// Toggle the state
		buttonState = !buttonState;
	});*/
//});
	
// Adds a listener that handle incoming messages
/*var lid = appAPI.message.addListener(function(msg) {
	// Performs action according to message type received
	switch (msg.type) {
		// Received message to broadcast to all tabs
		case 'all': appAPI.message.toAllTabs(msg); break;
		// Received message to broadcast to all tabs
		//case 'other': appAPI.message.toAllOtherTabs(msg); break;
		// Received message to send to the active tab
		case 'tab': 
			alert("background");
			appAPI.message.toActiveTab(msg); break;
		// Received message to remove listeners; Relay message all tabs, and then remove background listener
		case 'remove': appAPI.message.toAllTabs(msg); appAPI.message.removeListener(lid); break;
		// Received message to broadcast to all iframes on the active tab
		//case 'iframes': appAPI.message.toCurrentTabIframes(msg); break;
		// Received message to send to the iframe's parent page
		//case 'window': appAPI.message.toCurrentTabWindow(msg); break;
	}
});*/