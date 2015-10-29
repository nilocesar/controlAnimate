(function() {
  // Union of Chrome, Firefox, IE, Opera, and Safari console methods
  var methods = ["assert", "assert", "cd", "clear", "count", "countReset",
    "debug", "dir", "dirxml", "dirxml", "dirxml", "error", "error", "exception",
    "group", "group", "groupCollapsed", "groupCollapsed", "groupEnd", "info",
    "info", "log", "log", "markTimeline", "profile", "profileEnd", "profileEnd",
    "select", "table", "table", "time", "time", "timeEnd", "timeEnd", "timeEnd",
    "timeEnd", "timeEnd", "timeStamp", "timeline", "timelineEnd", "trace",
    "trace", "trace", "trace", "trace", "warn"];
  var length = methods.length;
  var console = (window.console = window.console || {});
  var method;
  var noop = function() {};
  while (length--) {
    method = methods[length];
    // define undefined methods as noops to prevent errors
    if (!console[method])
      console[method] = noop;
  }
})();

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var ie = function() {
  var rv = -1;
  var ua = "";
  var re = "";
  if (navigator.appName == "Microsoft Internet Explorer") {
    ua = navigator.userAgent;
    re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1);
    }
  } else {
    if (navigator.appName == "Netscape") {
      ua = navigator.userAgent;
      re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
      if (re.exec(ua) !== null) {
        rv = parseFloat(RegExp.$1);
      }
    }
  }
  return rv;
}();

(function(global) {
  var apple_phone = /iPhone/i;
  var apple_ipod = /iPod/i;
  var apple_tablet = /iPad/i;
  var windows_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i;
  var android_tablet = /Android/i;
  var other_blackberry = /BlackBerry/i;
  var other_opera = /Opera Mini/i;
  var android_phone = /IEMobile/i;
  var other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i;
  var seven_inch = RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i");
  var match = function(regex, userAgent) {
    return regex.test(userAgent);
  };
  var IsMobileClass = function(userAgent) {
    var ua = userAgent || navigator.userAgent;
    this.apple = {phone:match(apple_phone, ua), ipod:match(apple_ipod, ua), tablet:match(apple_tablet, ua), device:match(apple_phone, ua) || (match(apple_ipod, ua) || match(apple_tablet, ua))};
    this.android = {phone:match(windows_phone, ua), tablet:!match(windows_phone, ua) && match(android_tablet, ua), device:match(windows_phone, ua) || match(android_tablet, ua)};
    this.other = {blackberry:match(other_blackberry, ua), opera:match(other_opera, ua), windows:match(android_phone, ua), firefox:match(other_firefox, ua), device:match(other_blackberry, ua) || (match(other_opera, ua) || (match(android_phone, ua) || match(other_firefox, ua)))};
    this.seven_inch = match(seven_inch, ua);
    this.any = this.apple.device || (this.android.device || (this.other.device || this.seven_inch));
  };
  var IM = global.isMobile = new IsMobileClass();
  IM.Class = IsMobileClass;
})(window);

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

var formatTime = function(secs, withMMS)
{   
    var time = "00:00:00";
    var mms = (secs - Math.floor(secs)) * 100;
    mms = Math.floor(mms);      
    var h =Math.floor(secs/3600);
    var m =Math.floor((secs%3600)/60);
    var s =Math.floor((secs%3600)%60);
    if(withMMS == null || withMMS == false)
    {
        time = ((h<10?"0"+h.toString()+":":h.toString()+":"))+(m<10?"0"+m.toString():m.toString())+":"+(s<10?"0"+s.toString():s.toString());
    }else{
        time = ((h<10?"0"+h.toString()+":":h.toString()+":"))+(m<10?"0"+m.toString():m.toString())+":"+(s<10?"0"+s.toString():s.toString())+":"+(mms<10?"0"+mms.toString():mms.toString());
    }
    return time;
}

String.prototype.formatNumber = function() {
  return Number(this) <= 9 ? "0"+Number(this) : String(Number(this));
}

function returnDelta(elm) {            
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = elm.offset().top;
    bounds.bottom = bounds.top + elm.outerHeight();
    var height = elm.outerHeight();
    var deltas = {
        top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
        bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height)
    };            
    return deltas;
}        

function isOnScreen(elm) {            
    var delta = returnDelta(elm);
    return delta.bottom > 0;
}