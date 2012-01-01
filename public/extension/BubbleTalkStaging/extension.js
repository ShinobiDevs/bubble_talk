appAPI.ready(function($) {
    // Place your code here (you can also define new functions above this scope)
    // The $ object is the extension's jQuery object
    
	appAPI.resources.includeCSS('css/bubbleTalk.css');
	appAPI.resources.includeCSS('css/bubbleTalk-buttons.css');
	appAPI.resources.includeJS('js/bubbleTalk.js');
	
	appAPI.resources.includeCSS('css/jquery.mCustomScrollbar.css');
	appAPI.resources.includeJS('js/jquery.mCustomScrollbar.concat.min.js');
	
	//appAPI.dom.addRemoteCSS('http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.no-icons.min.css');
	appAPI.dom.addRemoteCSS('http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css');

	//link_to("<i class='icon-facebook-sign'></i>&nbsp;Share".html_safe, "https://www.facebook.com/sharer/sharer.php?u=#{URI.encode(request.original_url)}", class: "btn btn-primary btn-medium", target: "_blank", id: "facebook_share")

	
	$('<div class="bubbleTalk-toolbar">' +
		'<a class="btn btn-primary main-button">' +
			'<i class="icon-comment"></i>' +
		'</a>' +
	'</div>' +
	'<div id="social-sign-up" class="bubbleTalk-border">' +
		'<label>You are not signed in</label>' +
		'<label>Please <a href="http://localhost:3000">sign in</a></label>' +
	'</div>' +
	'<div id="bubbleTalk-actions" class="bubbleTalk-border">' +
		'<input type="button" id="add-bubble" class="btn btn-primary" value="Add Bubble" />' +
		'<a id="save-bubbles" class="btn btn-primary disabled">Save</a>' +
		'<a href="https://www.facebook.com/shrer/sharer.php?u=http://www.bubbletalk.com:3000" class="btn btn-primary" target="_blank" id="facebook_share">' +
			'<i class="icon-facebook-sign"> Share</i>' +
		'</a>' +
	'</div>').appendTo('body');

	var extensionShown = false;
	var current_user = null;
	var save_in_process = false;

	function load_share() {
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/v1/shares/" + current_user.id.$oid + ".json",
			data: { url: document.URL },
			success: function (data) {
    			Share.getInstance().load_share(data);
          	}
        });
	}

	function load_clicked_share(share_uuid) {
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/shares/" + current_user.id.$oid + ".json",
			data: { uuid: share_uuid },
			success: function (data) {
    			Share.getInstance().load_clicked_share(data);
          	}
        });
	}

	function load_clicked_data() {
		appAPI.db.async.get(document.URL, function(value) {
			if (value !== null) {
				appAPI.db.async.remove(document.URL);

				load_clicked_share(value);
			}
		});
	}

	function load_user(user_token) {
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/users/me.json?user_token=" + user_token,
			success: function (data) {
				current_user = new User();
				current_user.initUser(data);
				load_share();
				load_clicked_data();
			}
		});
	}

	appAPI.db.async.get('user_access_token', function(value) {
		if (value !== null)
			load_user(value);
		else {
			$(function() {
				$('body').fireExtensionEvent('requestUserToken');
			});
		}
	});

	$('body').bindExtensionEvent('postClickedData', function(e, data) {
		appAPI.db.async.set(data[0], data[1]);

		$(function() {
			$('body').fireExtensionEvent('recieveClickedData', true);
		});
	});

	$('body').bindExtensionEvent('postUserToken', function(e, data) {
		appAPI.db.async.set('user_access_token', data);
		load_user(data);
	});

	Share.getInstance().addEventListener("changed", shareChanged);

	$(".main-button").click(function() {
		if (extensionShown) {
			$(".bubbleTalk-toolbar").animate({"right": "-=230px"}, "slow");
			if (current_user === null)
				$("#social-sign-up").animate({"right": "-=230px"}, "slow");
			else
				$("#bubbleTalk-actions").animate({"right": "-=230px"}, "slow");

			extensionShown = false;
        } else {
			$(".bubbleTalk-toolbar").animate({"right": "+=230px"}, "slow");
			if (current_user === null)
				$("#social-sign-up").animate({"right": "+=230px"}, "slow");
			else
				$("#bubbleTalk-actions").animate({"right": "+=230px"}, "slow");

			extensionShown = true;
		}
	});

	$("#add-bubble").click(function() {
		var myDomOutline = BubbleTalkOutline();
		myDomOutline.start();
	});

	function enableSaveButton(enable) {
		if (!save_in_process)
			if (enable)
				$("#save-bubbles").removeClass("disabled");
			else
				if (!$("#save-bubbles").hasClass("disabled"))
					$("#save-bubbles").addClass("disabled");
	}

	function shareChanged(data) {
		if (data.isShareChanged)
			enableSaveButton(true);
		else
			enableSaveButton(false);
	}

	function handleNewShare(shareJSON) {
		$.ajax({
			type: "POST",
			url: "http://localhost:3000/v1/shares.json",
			data: { share: shareJSON },
			success: function (data) {
	            Share.getInstance().after_save(data);
	            save_in_process = false;
	            enableSaveButton(Share.getInstance().check_if_changed());
          	},
          	error: function (data) {
	            alert(data.message);
	            save_in_process = false;
	            enableSaveButton(Share.getInstance().check_if_changed());
          	}
        });
	}

	function handleDeleteShare() {
		var share_uuid = Share.getInstance().uuid;
		$.ajax({
			type: "DELETE",
			url: "http://localhost:3000/v1/shares/" + share_uuid + ".json",
			data: { uuid: share_uuid },
			success: function (data) {
	            Share.getInstance().after_delete();
	            save_in_process = false;
	            enableSaveButton(Share.getInstance().check_if_changed());
          	},
          	error: function (data) {
	            alert(data.message);
	            save_in_process = false;
	            enableSaveButton(Share.getInstance().check_if_changed());
          	}
        });
	}

	function handleUpdateShare(shareJSON) {
		var share_uuid = Share.getInstance().uuid;
		$.ajax({
			type: "PATCH",
			url: "http://localhost:3000/v1/shares/" + share_uuid + ".json",
			data: { uuid: share_uuid, share: shareJSON },
			success: function (data) {
	            Share.getInstance().after_save(data);
	            save_in_process = false;
	            enableSaveButton(Share.getInstance().check_if_changed());
          	},
          	error: function (data) {
	            alert(data.message);
	            save_in_process = false;
	            enableSaveButton(Share.getInstance().check_if_changed());
          	}
        });
	}

	$("#save-bubbles").click(function() {
		enableSaveButton(false);
		save_in_process = true;
		var shareJSON = Share.getInstance().to_json(current_user.id, document.URL);

		if (shareJSON === null)
			handleDeleteShare();
		else if (Share.getInstance().isShareNew)
			handleNewShare(shareJSON);
		else
			handleUpdateShare(shareJSON);
	});

	$("#facebook_share").click(function(e){
		e.preventDefault();
	    window.open('https://www.facebook.com/sharer/sharer.php?u=http://www.bubbletalk.com:3000/shares/'+Share.getInstance().uuid, "facebook-share-dialog", 'width=626,height=436');
  	})
});