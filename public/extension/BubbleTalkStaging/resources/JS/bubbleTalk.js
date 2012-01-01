function Position() {
    this.positionTop = 0;
    this.positionLeft = 0;
    this.positionWidth = 0;
    this.positionHeight = 0;
}

var User = function(options) {
    options = options || {};

    var pub = {
        authentication_token: "",
        email: "",
        name: "",
        profile_picture: "",
        id: null
    };

    var self = {};

    pub.initUser = function(userData) {
        pub.authentication_token = userData.authentication_token;
        pub.email = userData.email;
        pub.name = userData.name;
        pub.profile_picture = userData.profile_picture;
        pub.id = userData._id;
    };

    return pub;
};

var Bubble = function(options) {
    options = options || {};
  
    var pub = {
        isBubbleNew: true,
        isBubbleChanged: false,
        bubbleIDNum: options.bubbleIDNum || 0,
        isBubbleDeleted: false
    };

    var self = {
        opts: {
            direction: options.triangleClass || ""
        },
        bubbleTalkElem: null,
        bubble_id: null,
        uuid: null,
        events: {},
        body: "",
        body_saved: ""
    };

    pub.createBubbleByPosition = function(bubblePosition) {
        self.bubbleTalkElem = document.createElement("div");
        $(self.bubbleTalkElem).attr("id", "bubbleTalk" + pub.bubbleIDNum)
                              .addClass("bubbleTalk-oval")
                              .css({"left": bubblePosition.positionLeft + "px", "top": bubblePosition.positionTop + "px", "width": bubblePosition.positionWidth - 3 + "px", "height": bubblePosition.positionHeight - 30 + "px"})
                              .appendTo("body");
        if (self.opts.direction !== "")
            $(self.bubbleTalkElem).addClass("bubbleTalk-oval-" + self.opts.direction);
        
        var textareaElem = document.createElement("textarea");
        $(textareaElem).attr("id", "bubbleTalk_textarea" + pub.bubbleIDNum).attr("placeholder", "Enter your comment...")
                      .css({"width": $(self.bubbleTalkElem).width() - 18 + "px", "height": $(self.bubbleTalkElem).height() - 6 + "px"})
                      .appendTo(self.bubbleTalkElem)
                      .focus()
                      .blur(function() { changeToLabel(pub.bubbleIDNum); });

        var removeElem = document.createElement("i");
        $(removeElem).attr("id", "bubbleTalk_remove" + pub.bubbleIDNum)
                    .css({"left": bubblePosition.positionLeft + bubblePosition.positionWidth - 21 + "px", "top": bubblePosition.positionTop + 1 + "px", "position": "absolute", "z-index": 100000001, "color": "white"})
                    .addClass("icon-remove-circle")
                    .appendTo("body")
                    .click(function() { removeBubble(); });
    };

    pub.createBubbleWithData = function(bubble) {
        pub.isBubbleNew = false;
        pub.bubbleIDNum = bubble.bubble_id_num;
        self.opts.direction = bubble.direction;
        self.bubble_id = bubble._id;
        self.uuid = bubble.uuid;
        self.body = bubble.body;
        self.body_saved = bubble.body;

        self.bubbleTalkElem = document.createElement("div");
        $(self.bubbleTalkElem).attr("id", "bubbleTalk" + pub.bubbleIDNum)
                              .addClass("bubbleTalk-oval")
                              .css({"left": bubble.left + "px", "top": bubble.top + "px", "width": bubble.width - 3 + "px", "height": bubble.height - 30 + "px"})
                              .appendTo("body");
        if (self.opts.direction !== "")
            $(self.bubbleTalkElem).addClass("bubbleTalk-oval-" + self.opts.direction);

        var labelElem = document.createElement("label");
        $(labelElem).attr("id", "bubbleTalk_label" + pub.bubbleIDNum)
                    .text(self.body_saved)
                    .appendTo(self.bubbleTalkElem)
                    //.insertBefore($(self.bubbleTalkElem).children(":first"))
                    .mCustomScrollbar();
        
        $(self.bubbleTalkElem).click(function() { changeToText(); });

        var removeElem = document.createElement("i");
        $(removeElem).attr("id", "bubbleTalk_remove" + pub.bubbleIDNum)
                    .css({"left": bubble.left + bubble.width - 21 + "px", "top": bubble.top + 1 + "px", "position": "absolute", "z-index": 100000001, "color": "white"})
                    .addClass("icon-remove-circle")
                    .appendTo("body")
                    .click(function() { removeBubble(); });
    };

    pub.createSharedBubble = function(bubble) {
        pub.bubbleIDNum = bubble.bubble_id_num;
        self.opts.direction = bubble.direction;
        self.bubble_id = bubble._id;
        self.uuid = bubble.uuid;
        self.body = bubble.body;

        self.bubbleTalkElem = document.createElement("div");
        $(self.bubbleTalkElem).attr("id", "sharedBubbleTalk" + pub.bubbleIDNum)
                              .addClass("bubbleTalk-oval")
                              .css({"left": bubble.left + "px", "top": bubble.top + "px", "width": bubble.width - 3 + "px", "height": bubble.height - 30 + "px"})
                              .appendTo("body");
        if (self.opts.direction !== "")
            $(self.bubbleTalkElem).addClass("bubbleTalk-oval-" + self.opts.direction);

        var labelElem = document.createElement("label");
        $(labelElem).attr("id", "sharedBubbleTalk_label" + pub.bubbleIDNum)
                    .text(self.body)
                    .appendTo(self.bubbleTalkElem)
                    .mCustomScrollbar();
    }

    pub.addEventListener = function (key, func) {
        if (!self.events.hasOwnProperty(key)) {
            self.events[key] = [];
        }
        self.events[key].push(func);
    };

    pub.removeEventListener = function (key, func) {
        if (self.events.hasOwnProperty(key)) {
            for (var i in self.events[key]) {
                if (self.events[key][i] === func) {
                    self.events[key].splice(i, 1);
                }
            }
        }
    };

    pub.to_json = function(url) {
        if (pub.isBubbleDeleted || !self.body)
            return null;

        pub.isBubbleChanged = false;

        var elemPos = $(self.bubbleTalkElem).offset();
        var bubbleTalkLabelID = "#bubbleTalk_label" + pub.bubbleIDNum;

        bubbleJSON = {
            "left": elemPos.left,
            "top": elemPos.top,
            "height": $(self.bubbleTalkElem).outerHeight(),
            "width": $(self.bubbleTalkElem).outerWidth(),
            "direction": self.opts.direction,
            "body": self.body,
            "url": url,
            "bubble_id_num": pub.bubbleIDNum
        };

        if (!pub.isBubbleNew) {
            bubbleJSON._id = self.bubble_id.$oid;
            bubbleJSON.uuid = self.uuid;
        }

        return bubbleJSON;
    };

    pub.to_delete_json = function() {
        var deletedBubbleJSON = {
            "_id": self.bubble_id.$oid,
            "_destroy": 1
        };

        return deletedBubbleJSON;
    };

    pub.after_save = function(data) {
        if (pub.isBubbleNew) {
            pub.isBubbleNew = false;
            self.bubble_id = data._id;
            self.uuid = data.uuid;
        }
    
        self.body_saved = data.body;
    };

    pub.removeBubbleElem = function() {
        var removeElem = "#bubbleTalk_remove" + pub.bubbleIDNum;

        $(self.bubbleTalkElem).remove();
        $(removeElem).remove();
    };

    function dispatchEvent(key, dataObj) {
        if (self.events.hasOwnProperty(key)) {
            dataObj = dataObj || {};
            dataObj.currentTarget = this;
            for (var i in self.events[key]) {
                self.events[key][i](dataObj);
            }
        }
    }

    function changeToLabel() {
        var textareaId = "#bubbleTalk_textarea" + pub.bubbleIDNum;
        var removeElem = "#bubbleTalk_remove" + pub.bubbleIDNum;
        var labelText = "Press here to write something...";
        if ($(textareaId).val() !== "") {
            labelText = $(textareaId).val();
            self.body = labelText;

            if ((pub.isBubbleNew || self.body !== self.body_saved) && (!pub.isBubbleChanged)) {
                pub.isBubbleChanged = true;
                dispatchEvent("changed", { isBubbleChanged: pub.isBubbleChanged });
            } else if (pub.isBubbleChanged) {
                pub.isBubbleChanged = false;
                dispatchEvent("changed", { isBubbleChanged: pub.isBubbleChanged });
            }
        } else {
            self.body = "";
            if (pub.isBubbleNew && pub.isBubbleChanged) {
                pub.isBubbleChanged = false;
                dispatchEvent("changed", { isBubbleChanged: pub.isBubbleChanged });
            } else if (!pub.isBubbleNew && !pub.isBubbleChanged) {
                pub.isBubbleChanged = true;
                dispatchEvent("changed", { isBubbleChanged: pub.isBubbleChanged });
            }
        }

        $(textareaId).remove();

        var labelElem = document.createElement("label");
        $(labelElem).attr("id", "bubbleTalk_label" + pub.bubbleIDNum)
                    .text(labelText)
                    .appendTo(self.bubbleTalkElem)
                    //.insertBefore($(self.bubbleTalkElem).children(":first"))
                    .mCustomScrollbar();
    
        $(self.bubbleTalkElem).click(function() { changeToText(); });
    }

    function changeToText() {
        var bubbleTalkLabelID = "#bubbleTalk_label" + pub.bubbleIDNum;
        var removeElem = "#bubbleTalk_remove" + pub.bubbleIDNum;

        var textareaText = "";
        if ($(bubbleTalkLabelID).text() !== "Press here to write something...")
            textareaText = $(bubbleTalkLabelID).text();

        $(self.bubbleTalkElem).off("click");

        $(bubbleTalkLabelID).remove();

        var textareaElem = document.createElement('textarea');
        $(textareaElem).attr("id", "bubbleTalk_textarea" + pub.bubbleIDNum)
                      .css({"width": $(self.bubbleTalkElem).width() - 18 + "px", "height": $(self.bubbleTalkElem).height() - 6 + "px"})
                      //.insertBefore($(self.bubbleTalkElem).children(":first"))
                      .appendTo(self.bubbleTalkElem)
                      .focus()
                      .blur(function() { changeToLabel(); });
        if (textareaText)
            $(textareaElem).val(textareaText);
        else
            $(textareaElem).attr("placeholder", "Enter your comment...");
    }

    function removeBubble() {
        pub.removeBubbleElem();

        isBubbleDeleted = true;
        self.body = "";
        if (pub.isBubbleNew)
            pub.isBubbleChanged = false;
        else
            pub.isBubbleChanged = true;

        dispatchEvent("removed", { bubbleIDNum: pub.bubbleIDNum });
    }

    return pub;
};

var Share = (function() {
    var instance;

    function init() {
        var pub = {
            uuid: "",
            isShareNew: true
        };

        var self = {
            bubbles: [],
            bubbleCounter: 0,
            events: {},
            share_id: null,
            last_bubble_id: 0
        };

        pub.addNewBubbleByPosition = function(bubblePosition) {
            var newBubble = new Bubble({ bubbleIDNum: self.bubbleCounter });
            newBubble.createBubbleByPosition(bubblePosition);
            self.bubbleCounter++;
        };
    
        pub.addNewBubbleWithTriangle = function(bubblePosition, triangleClass) {
            self.last_bubble_id++;
            var newBubble = new Bubble({ bubbleIDNum: self.last_bubble_id, triangleClass: triangleClass });
            newBubble.createBubbleByPosition(bubblePosition);
            newBubble.addEventListener("removed", handleBubbleRemove);
            newBubble.addEventListener("changed", handleBubbleChanged);
            self.bubbles.push(newBubble);
            self.bubbleCounter++;
        };

        pub.addEventListener = function (key, func) {
            if (!self.events.hasOwnProperty(key)) {
                self.events[key] = [];
            }
            self.events[key].push(func);
        };

        pub.removeEventListener = function (key, func) {
            if (self.events.hasOwnProperty(key)) {
                for (var i in self.events[key]) {
                    if (self.events[key][i] === func) {
                        self.events[key].splice(i, 1);
                    }
                }
            }
        };

        pub.to_json = function(user_id, url) {
            bubblesJSON = [];
            destroyBubblesJson = [];
            bubbleIDSToDelete = [];
            for (var i = 0; i < self.bubbles.length; i++) {
                var bubbleJSON = self.bubbles[i].to_json(url);
                if (bubbleJSON === null) {
                    if (!self.bubbles[i].isBubbleNew) {
                        var deleteBubbleJSON = self.bubbles[i].to_delete_json();
                        destroyBubblesJson.push(deleteBubbleJSON);
                    }

                    if (!self.bubbles[i].isBubbleDeleted) {
                        self.bubbles[i].removeBubbleElem();

                        bubbleIDSToDelete.push(self.bubbles[i].bubbleIDNum);
                    }
                } else {
                    bubblesJSON.push(bubbleJSON);
                }
            }

            for (i = 0; i < bubbleIDSToDelete.length; i++) {
                for (var j = 0; j < self.bubbles.length; j++) {
                    if (self.bubbles[j].bubbleIDNum === bubbleIDSToDelete[i]) {
                        self.bubbles.splice(j, 1);
                        break;
                    }
                }
            }

            if (bubblesJSON.length === 0)
                return null;

            shareJSON =  {
                "user_id": user_id.$oid,
                "url": url
            };

            if (!pub.isShareNew) {
                shareJSON._id = self.share_id.$oid;
                shareJSON.uuid = pub.uuid;
            }

            shareJSON.bubbles_attributes = bubblesJSON;
            if (destroyBubblesJson.length > 0) {
                for (i = 0; i < destroyBubblesJson.length; i++) {
                    shareJSON.bubbles_attributes.push(destroyBubblesJson[i]);
                }
            }

            return shareJSON;
        };

        pub.after_save = function(data) {
            if (pub.isShareNew) {
                pub.isShareNew = false;
                self.share_id = data._id;
                pub.uuid = data.uuid;
            }

            for (var i = 0; i < data.bubbles.length; i++) {
                for (var j = 0; j < self.bubbles.length; j++) {
                    if (self.bubbles[j].bubbleIDNum === data.bubbles[i].bubble_id_num) {
                        self.bubbles[j].after_save(data.bubbles[i]);
                        break;
                    }
                }
            }
        };

        pub.after_delete = function() {
            pub.uuid = "";
            pub.isShareNew = true;
            self.bubbles = [];
            self.bubbleCounter = 0;
            self.share_id = null;
        };

        pub.check_if_changed = function() {
            for (var i = 0; i < self.bubbles.length; i++) {
                var bubble = self.bubbles[i];
                if (bubble.isBubbleChanged)
                    return true;
            }

            return false;
        };

        pub.load_share = function(data) {
            pub.uuid = data.uuid;
            pub.isShareNew = false;
            self.share_id = data._id;

            for (var i = 0; i < data.bubbles.length; i++) {
                var bubbleID = data.bubbles[i].bubble_id_num;

                var newBubble = new Bubble();
                newBubble.createBubbleWithData(data.bubbles[i]);
                newBubble.addEventListener("removed", handleBubbleRemove);
                newBubble.addEventListener("changed", handleBubbleChanged);
                self.bubbles.push(newBubble);

                if (bubbleID > self.last_bubble_id)
                    self.last_bubble_id = bubbleID;

                self.bubbleCounter++;
            }
        };

        pub.load_clicked_share = function(data) {
            for (var i = 0; i < data.bubbles.length; i++) {
                var bubbleID = data.bubbles[i].bubble_id_num;

                var newBubble = new Bubble();
                newBubble.createSharedBubble(data.bubbles[i]);
            }
        };

        function dispatchEvent(key, dataObj) {
            if (self.events.hasOwnProperty(key)) {
                dataObj = dataObj || {};
                dataObj.currentTarget = this;
                for (var i in self.events[key]) {
                    self.events[key][i](dataObj);
                }
            }
        }

        function handleBubbleChanged(data) {
            if (data.isBubbleChanged)
                dispatchEvent("changed", { isShareChanged: true });
            else if (pub.check_if_changed())
                dispatchEvent("changed", { isShareChanged: true });
            else
                dispatchEvent("changed", { isShareChanged: false });
        }

        function handleBubbleRemove(data) {
            if (pub.check_if_changed())
                dispatchEvent("changed", { isShareChanged: true });
            else
                dispatchEvent("changed", { isShareChanged: false });
        }

        return pub;
    }

    return {
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();

var BubbleTalkOutline = function(options) {
    options = options || {};

    var pub = {
        element: this
    };
    var self = {
        opts: {
            namespace: options.namespace || "BubbleTalkOutline",
            borderWidth: options.borderWidth || 2,
            onClick: options.onClick || function() {
                createBubble(pub.element);
            }
        },
        keyCodes: {
            BACKSPACE: 8,
            ESC: 27,
            DELETE: 46
        },
        active: false,
        elements: {}
    };

    function createOutlineElements() {
        self.elements.top = jQuery("<div></div>").addClass(self.opts.namespace).appendTo("body");
        self.elements.bottom = jQuery("<div></div>").addClass(self.opts.namespace).appendTo("body");
        self.elements.left = jQuery("<div></div>").addClass(self.opts.namespace).appendTo("body");
        self.elements.right = jQuery("<div></div>").addClass(self.opts.namespace).appendTo("body");
    }

    function removeOutlineElements() {
        $("." + self.opts.namespace).remove();
    }

    function getScrollTop() {
        if (!self.elements.window) {
            self.elements.window = jQuery(window);
        }
        return self.elements.window.scrollTop();
    }

    function updateOutlinePosition(e) {
        if (e.target.className.indexOf(self.opts.namespace) !== -1) {
            return;
        }
        pub.element = e.target;

        var b = self.opts.borderWidth;
        var scroll_top = getScrollTop();
        var pos = pub.element.getBoundingClientRect();
        var top = pos.top + scroll_top;

        self.elements.top.css({top: Math.max(0, top - b), left: pos.left - b, width: pos.width + b, height: b});
        self.elements.bottom.css({top: top + pos.height, left: pos.left - b, width: pos.width + b, height: b});
        self.elements.left.css({top: top - b, left: Math.max(0, pos.left - b), width: b, height: pos.height + b});
        self.elements.right.css({top: top - b, left: pos.left + pos.width, width: b, height: pos.height + (b * 2)});
    }

    function stopOnEscape(e) {
        if (e.keyCode === self.keyCodes.ESC || e.keyCode === self.keyCodes.BACKSPACE || e.keyCode === self.keyCodes.DELETE) {
            pub.stop();
        }

        return false;
    }

    function clickHandler(e) {
        pub.stop();
        self.opts.onClick(pub.element);

        return false;
    }

    function createBubble(element) {
        //width: 165, height: 100
        var triangleName = "";
        var elemPos = $(element).offset();
        var posNewBubble = new Position();
        if ($(element).outerWidth() + elemPos.left + 195 <= $(document).width()) {
            posNewBubble.positionTop = elemPos.top;
            posNewBubble.positionWidth = 165;
            posNewBubble.positionHeight = 100;
            posNewBubble.positionLeft = elemPos.left + $(element).outerWidth() + 30;
            triangleName = "right";
        } else if (elemPos.left - 195 >= 0) {
            posNewBubble.positionTop = elemPos.top;
            posNewBubble.positionWidth = 165;
            posNewBubble.positionHeight = 100;
            posNewBubble.positionLeft = elemPos.left - 195;
            triangleName = "left";
        } else if (elemPos.top - 130 >= 0) {
            posNewBubble.positionTop = elemPos.top - 130;
            posNewBubble.positionWidth = 165;
            posNewBubble.positionHeight = 100;
            posNewBubble.positionLeft = elemPos.left;
            triangleName = "top";
        } else if (elemPos.top + $(element).outerHeight() + 140 <= $(document).height()) {
            posNewBubble.positionTop = elemPos.top + $(element).outerHeight() + 30;
            posNewBubble.positionWidth = 165;
            posNewBubble.positionHeight = 100;
            posNewBubble.positionLeft = elemPos.left;
            triangleName = "bottom";
        }
        else {
            return;
        }

        Share.getInstance().addNewBubbleWithTriangle(posNewBubble, triangleName);
    }

    pub.start = function() {
        if (self.active !== true) {
            self.active = true;
            createOutlineElements();
            jQuery("body").on("mousemove." + self.opts.namespace, updateOutlinePosition);
            jQuery("body").on("keyup." + self.opts.namespace, stopOnEscape);
            if (self.opts.onClick) {
                setTimeout(function() {
                    jQuery("body").on("click." + self.opts.namespace, clickHandler);
                }, 50);
            }
        }
    };

    pub.stop = function() {
        self.active = false;
        removeOutlineElements();
        jQuery("body").off("mousemove." + self.opts.namespace)
                      .off("keyup." + self.opts.namespace)
                      .off("click." + self.opts.namespace);
    };

    return pub;
};

var Squarebubble = function() {
    var pub = {};
    var self = {
        isDown: false,
        xDown: 0,
        yDown: 0,
        dragSquareElement: null
    };

    pub.createSquareElement = function() {
        if (!self.dragSquareElement) {
            self.dragSquareElement = document.createElement("div");
            $(self.dragSquareElement).attr("id", "bubbleTalk_dragSquare")
                                    .addClass("bubbleTalk-unselectable")
                                    .attr("bubbleTalk-unselectable", "on")
                                    .css({"display": "none", "position": "absolute"})
                                    .appendTo("body");
        }

        registerEvents();
    };

    function registerEvents() {
        $(document).on("mousedown", function(event) {
            setSquareStartPosition(event);
        });
        $(document).on("mouseup", function(event) {
            createBubbleInSquare(event);
        });
        $(document).on("mousemove", function(event) {
            setSquareSize(event);
        });
    }

    function setSquareStartPosition(e) {
        self.isDown = true;
        self.xDown = e.pageX;
        self.yDown = e.pageY;

        $(self.dragSquareElement).css({"left": e.pageX + "px", "top": e.pageY + "px"});
    }

    function calculateSquarePosition(currX, currY) {
        var calcPosition = new Position();

        var currMouseX = currX;
        if (currX < 0)
            currMouseX = 0;

        var currMouseY = currY;
        if (currY < 0)
            currMouseY = 0;

        calcPosition.positionLeft = (self.xDown > currMouseX) ? currMouseX : self.xDown;
        calcPosition.positionTop = (self.yDown > currMouseY) ? currMouseY : self.yDown;
        calcPosition.positionWidth = (self.xDown > currMouseX) ? self.xDown - currMouseX : currMouseX - self.xDown;
        calcPosition.positionHeight = (self.yDown > currMouseY) ? self.yDown - currMouseY : currMouseY - self.yDown;

        return calcPosition;
    }

    function setSquareSize(e) {
        if (!self.isDown)
            return;

        var dragPosition = calculateSquarePosition(e.pageX, e.pageY);

        $(self.dragSquareElement).css({"width": dragPosition.positionWidth + "px", "height": dragPosition.positionHeight + "px", "left": dragPosition.positionLeft + "px", "top": dragPosition.positionTop + "px"});

        if ($(self.dragSquareElement).css("display") === "none")
            $(self.dragSquareElement).css("display", "block");
    }

    function createBubbleInSquare(e) {
        self.isDown = false;
        $(self.dragSquareElement).css({"width": "0px", "height": "0px", "left": "0px", "top": "0px", "display": "none"});

        var bubblePosition = calculateSquarePosition(e.pageX, e.pageY);

        unRegisterEvents();

        Share.getInstance().addNewBubbleByPosition(bubblePosition);
    }

    function unRegisterEvents() {
        $(document).off("mousedown");
        $(document).off("mouseup");
        $(document).off("mousemove");
    }

    return pub;
};

var BubbleTalkToolbar = (function() {
    var instance;

    function init() {
        var pub = { };

        var self = {
            isMainHidden: true,
            isFreestyleHidden: true,
            isFixedHidden: true
        };

        function removeMainToolbar() {
            $("#bubbleTalk-fixed").remove();
            $("#bubbleTalk-freestyle").remove();
            $("#bubbleTalk-toolbarDiv").remove();
        }

        function removeFreestyleToolbar() {
            $("#bubbleTalk-freestyle-toolbar").remove();
        }

        function removeFixedToolbar() {
            $("#bubbleTalk-fixed-toolbar").remove();
        }

        function hideFreestyleToolbar() {
            $("#bubbleTalk-freestyle-toolbar").animate({"top": "-=30px"}, "slow", function() { 
                removeFreestyleToolbar();
                self.isFreestyleHidden = true;
            });
        }        

        function hideFixedToolbar() {
            $("#bubbleTalk-fixed-toolbar").animate({"top": "-=30px"}, "slow", function() { 
                removeFixedToolbar();
                self.isFixedHidden = true;
            });
        }

        function changeToolbarPosition(){
            var toolbarTop = window.scrollY;
            var toolbarLeft = window.scrollX;
            var toolbarId; 

            if (!self.isMainHidden) {
                toolbarId = "bubbleTalk-toolbarDiv";
            } else if (!self.isFixedHidden) {
                toolbarId = "bubbleTalk-fixed-toolbar";
            } else {
                toolbarId = "bubbleTalk-freestyle-toolbar";
            }

            $("#" + toolbarId).css({"top":toolbarTop + "px", "left":toolbarLeft + "px"});
        }

        function addFreestyleBubble() {
            var square = new Squarebubble();
            square.createSquareElement();
        }

        function addFixedBubble() {
            var myDomOutline = BubbleTalkOutline();
            myDomOutline.start();
        }

        function createFreestyleToolbar() {
            var freestyleToolbar = document.createElement("div");
            $(freestyleToolbar).attr("id", "bubbleTalk-freestyle-toolbar")
                                .addClass("bubbleTalk-small-toolbar")
                                .appendTo("body");
            var another = document.createElement("input");
            $(another).attr("id", "bubbleTalk-another")
                     .attr("type", "button")
                     .addClass("btn").addClass("btn-primary").addClass("btn-mini")
                     .val("Add Another Freestyle Bubble")
                     .text("Add Another Freestyle Bubble")
                     .click(function() { addFreestyleBubble(); })
                     .appendTo(freestyleToolbar);
            var finish = document.createElement("input");
            $(finish).attr("id", "bubbleTalk-close")
                    .attr("type", "button")
                    .addClass("btn").addClass("btn-primary").addClass("btn-mini")
                    .val("Finish")
                    //.text("Finish")
                    .click(function() { hideFreestyleToolbar(); })
                    .appendTo(freestyleToolbar);
        }

        function createFixedToolbar() {
            var fixedToolbar = document.createElement("div");
            $(fixedToolbar).attr("id", "bubbleTalk-fixed-toolbar")
                            .addClass("bubbleTalk-small-toolbar")
                            .appendTo("body");
            var another = document.createElement("input");
            $(another).attr("id", "bubbleTalk-another")
                     .attr("type", "button")
                     .addClass("btn").addClass("btn-primary").addClass("btn-mini")
                     .val("Add Another Fixed Bubble")
                     .text("Add Another Fixed Bubble")
                     .click(function() { addFixedBubble(); })
                     .appendTo(fixedToolbar);
            var finish = document.createElement("input");
            $(finish).attr("id", "bubbleTalk-close")
                    .attr("type", "button")
                    .addClass("btn").addClass("btn-primary").addClass("btn-mini")
                    .val("Finish")
                    //.text("Finish")
                    .click(function() { hideFixedToolbar(); })
                    .appendTo(fixedToolbar);
        }

        function showFixedToolbar() {
            createFixedToolbar();
            $("#bubbleTalk-fixed-toolbar").animate({"top": "+=30px"}, "slow", function() {
                self.isFixedHidden = false;
            });
        }

        function showFreestyleToolbar() {
            createFreestyleToolbar();
            $("#bubbleTalk-freestyle-toolbar").animate({"top": "+=30px"}, "slow", function() {
                self.isFreestyleHidden = false;
            });
        }

        function hideMainToolbar(functionHandler) {
            $("#bubbleTalk-toolbarDiv").animate({"top": "-=100px"}, "slow", function() { 
                removeMainToolbar();
                self.isMainHidden = true;
                functionHandler();
            });
        }

        function handleFreestyle() {
            hideMainToolbar( function() { showFreestyleToolbar(); });
            addFreestyleBubble();
        }

        function handleFixed() {
            hideMainToolbar( function() { showFixedToolbar(); });
            addFixedBubble();
        }

        function createToolbar() {
            var toolbar = document.createElement("div");
            $(toolbar).attr("id", "bubbleTalk-toolbarDiv")
                     .addClass("bubbleTalk1-toolbar")
                     .appendTo("body");
            var freestyle = document.createElement("input");
            $(freestyle).attr("id", "bubbleTalk-freestyle")
                        .attr("type", "button")
                        .addClass("btn").addClass("btn-primary").addClass("btn-large")
                        .val("Freestyle Bubble")
                        //.text("Freestyle Bubble")
                        .click(function() { handleFreestyle(); })
                        .appendTo(toolbar);
            var fixed = document.createElement("input");
            $(fixed).attr("id", "bubbleTalk-fixed")
                    .attr("type", "button")
                    .addClass("btn").addClass("btn-primary").addClass("btn-large")
                    .val("Fixed Bubble")
                    //.text("Fixed Bubble")
                    .click(function() { handleFixed(); })
                    .appendTo(toolbar);
        }

        function showMainToolbar() {
            createToolbar();
            $("#bubbleTalk-toolbarDiv").animate({"top": "+=100px"}, "slow", function() {
                self.isMainHidden = false;
            });
        }

        pub.showHideToolbar = function() {
            if (self.isMainHidden && self.isFixedHidden && self.isFreestyleHidden) {
                showMainToolbar();
            } else {
                if (!self.isMainHidden) {
                    hideMainToolbar();
                } else if (!self.isFreestyleHidden) {
                    hideFreestyleToolbar();
                } else {
                    hideFixedToolbar();
                }
            }
        };

        return pub;
    }

    return {
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();