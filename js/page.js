var p = {};
p.onInit = function(){};
p.onEnd = function(){};
var self = window;

function applyAnimations()
{	
	p.onInit();
	$('div[data-animate="true"]').each(function(i,e)
	{		
		init(e);
	});
	$('div[data-animate="true"]').each(function(i,e)
	{		
		if(String($(e).data("start")) === "true")
		{
			open(e);
		}
	});

	$('div[data-popup]').each(function(i,e)
	{
		$(e).off("click").on("click", function(event){			
			event.stopPropagation();
			closeAllPopups();
			$(this).attr("data-complete","true");
			open($(this).data("popup"));
			window.index.checkEnd();
		});
	});

	$('html').on("click", function() {
		closeAllPopups();
	});

	revealOnScroll();
};

function randomAnimation()
{
	var animationsType = ["fadeIn", "fadeInLeft", "scaleOut", "scaleIn", "fadeInRight", "fadeInUp", "fadeInDown"];
	return shuffle(animationsType)[0];
}

function closeAllPopups()
{
	$('.popup').each(function(i,e)
	{
		close($(e).attr("id"));
	});
}

function revealOnScroll() {                        
    var scrolled = $window.scrollTop();
    $('#wrapper').find("div:not(.animated)").each(function() {

        var $this = $(this);

        if(!$this.attr("data-animate") == true)
        {
            
            console.log( $this.data('animation') )
            
	        var objInit = {};
	        var objEnd = {};
	        var time = $this.data('time') != undefined ? parseInt($this.data('time'), 10) : 1;
	        var delay = $this.data('delay') != undefined ? parseInt($this.data('delay'), 10) : 0;
	        var animation = $this.data('animation') || randomAnimation();
	        var distance = $this.data('distance') != undefined ? parseInt($this.data('distance'), 10) : 40;
	        var offsetTop = $this.offset().top;
	        var extraOffset = $this.data('offset') != undefined ? parseInt($this.data('offset'), 10) : 200;

	        if (scrolled + win_height_padded > (offsetTop + extraOffset)) {                                                
	            switch(animation)
	            {
	                case "fadeIn":
	                    objInit.opacity = 0;
	                    objEnd.opacity = 1;
	                    break;
	                case "fadeInLeft":
	                    objInit.opacity = 0;
	                    objEnd.opacity = 1;
	                    objInit.x = ((distance)*-1);
	                    objEnd.x = 0;
	                    break;
	                case "fadeInRight":
	                    objInit.opacity = 0;
	                    objEnd.opacity = 1;
	                    objInit.x = distance;
	                    objEnd.x = 0;
	                    break;
	                case "fadeInUp":
	                    objInit.opacity = 0;
	                    objEnd.opacity = 1;
	                    objInit.y = distance;
	                    objEnd.y = 0;
	                    break;
	                case "scaleIn":
	                    objInit.scale = .7;
	                    objInit.opacity = 0;
	                    objEnd.scale = 1;
	                    objEnd.opacity = 1;
	                    objInit.y = distance;
	                    objEnd.y = 0;
	                    break;
	                case "scaleOut":
	                    objInit.scale = 1.3;
	                    objInit.opacity = 0;
	                    objEnd.scale = 1;
	                    objEnd.opacity = 1;
	                    objInit.y = distance;
	                    objEnd.y = 0;
	                    break;
	                case "fadeInDown":
	                    objInit.opacity = 0;
	                    objEnd.opacity = 1;
	                    objInit.y = ((distance)*-1);
	                    objEnd.y = 0;
	                    break;
	            }
	            objEnd.delay = (delay/1000);                        
	            TweenLite.fromTo($this, time, objInit, objEnd);
	            $this.addClass('animated');                        
	        }
	    }

    });
}

function init(e)
{	
	if(typeof(e) == "string")
	{
		e = $("#"+e).get(0);
	}
	var animate_type = String($(e).data("type")) == "undefined" ? "fade" : String($(e).data("type"));
	var animate_time = String($(e).data("time")) == "undefined" ? .7 : Number($(e).data("time"));	
	switch(animate_type)
	{
		case "fade":
			TweenLite.set(e, {opacity:0});
			self.exec("onInit", e);
		break;
		case "fadeInToLeft":
			TweenLite.set(e, {x:50, opacity:0});
			self.exec("onInit", e);
		break;
		case "fadeInToRight":
			TweenLite.set(e, {x:-50, opacity:0});
			self.exec("onInit", e);
		break;
		case "fadeInToUp":
			TweenLite.set(e, {y:50, opacity:0});
			self.exec("onInit", e);
		break;
		case "fadeInToDown":
			TweenLite.set(e, {y:-50, opacity:0});
			self.exec("onInit", e);
		break;
	}	
};

function open(e)
{
	if(typeof(e) == "string")
	{
		e = $("#"+e).get(0);
	}
	var animate_type = String($(e).data("type")) == "undefined" ? "fade" : String($(e).data("type"));
	var animate_time = String($(e).data("time")) == "undefined" ? .7 : Number($(e).data("time"));
	var animate_delay = String($(e).data("delay")) == "undefined" ? 0 : Number($(e).data("delay"));	
	$(e).show();
	switch(animate_type)
	{
		case "fade":			
			self.exec("onStartOpen", e);
			TweenLite.to(e, animate_time, {opacity:1, delay:animate_delay, onComplete:function(){
				self.exec("onOpen", this.target);
			}});
		break;
		case "fadeInToLeft":
			self.exec("onStartOpen", e);
			TweenLite.to(e, animate_time, {x:0, delay:animate_delay, opacity:1, onComplete:function(){				
				self.exec("onOpen", this.target);
			}});
		break;
		case "fadeInToRight":
			self.exec("onStartOpen", e);
			TweenLite.to(e, animate_time, {x:0, delay:animate_delay, opacity:1, onComplete:function(){
				self.exec("onOpen", this.target);
			}});
		break;
		case "fadeInToUp":
			self.exec("onStartOpen", e);
			TweenLite.to(e, animate_time, {y:0, delay:animate_delay, opacity:1, onComplete:function(){				
				self.exec("onOpen", this.target);
			}});
		break;
		case "fadeInToDown":
			self.exec("onStartOpen", e);
			TweenLite.to(e, animate_time, {y:0, delay:animate_delay, opacity:1, onComplete:function(){
				self.exec("onOpen", this.target);
			}});
		break;
	}
};

function close(e)
{
	if(typeof(e) == "string")
	{
		e = $("#"+e).get(0);
	}
	var animate_type = String($(e).data("type")) == "undefined" ? "fade" : String($(e).data("type"));
	var animate_time = String($(e).data("time")) == "undefined" ? .7 : Number($(e).data("time"));	
	switch(animate_type)
	{
		case "fade":
			self.exec("onStartClose", e);
			TweenLite.to(e, animate_time, {opacity:0 ,onComplete:function(){
				self.exec("onClose", this.target);
				$(this.target).hide();
			}});
		break;
		case "fadeInToLeft":
			self.exec("onStartClose", e);
			TweenLite.to(e, animate_time, {x:50, opacity:0, onComplete:function(){
				self.exec("onClose", this.target);
				$(this.target).hide();
			}});
		break;
		case "fadeInToRight":
			self.exec("onStartClose", e);
			TweenLite.to(e, animate_time, {x:-50, opacity:0, onComplete:function(){
				self.exec("onClose", this.target);
				$(this.target).hide();
			}});
		break;
		case "fadeInToUp":
			self.exec("onStartClose", e);
			TweenLite.to(e, animate_time, {y:50, opacity:0, onComplete:function(){
				self.exec("onClose", this.target);
				$(this.target).hide();
			}});
		break;
		case "fadeInToDown":
			self.exec("onStartClose", e);
			TweenLite.to(e, animate_time, {y:-50, opacity:0, onComplete:function(){
				self.exec("onClose", this.target);
				$(this.target).hide();
			}});
		break;
	}
};

function exec(evt, e)
{
	if(typeof(e) == "string")
	{
		e = $("#"+e).get(0);
	}
	var str_cmd = "";
	switch(evt)
	{
		case "onInit":
			str_cmd = String($(e).data("on-init"));
			$(e).trigger("init");
		break;
		case "onStartOpen":

			if(String($(e).data("audio")) != "undefined")
			{
				var sound = index.getSound(String($(e).data("audio")));
				if(sound != null)
				{					
					if(String($(e).data("on-audio-end")) != "undefined")
					{
						$(e).trigger("audio-end");
						window.parent.$(sound).off("end").on("end", function(){							
							window.parent.$(sound).off("end");							
							eval(String($(e).data("on-audio-end")));
						});
					}
					sound.play();
				}				
			}

			str_cmd = String($(e).data("on-start-open"));
			$(e).trigger("start-open");
		break;
		case "onOpen":
			str_cmd = String($(e).data("on-open"));
			$(e).trigger("open");
		break;
		case "onStartClose":
			str_cmd = String($(e).data("on-start-close"));
			$(e).trigger("start-close");
		break;
		case "onClose":
			str_cmd = String($(e).data("on-close"));
			$(e).trigger("close");
		break;
	}
	if(str_cmd != undefined)
	{	
		eval(str_cmd);
	}
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}