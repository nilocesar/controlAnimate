/*********************************
* [KODEN]
* @author   Leonardo Hessel
* @since    02.10.2015
**********************************/

///////////////////////////////////////////////////
// INDEX [ CLASS ]
///////////////////////////////////////////////////

var Index = (function(superClass) {             
    
    Index.fn = Index.prototype;

    ///////////////////////////////////////
    // Variables
    ///////////////////////////////////////
    Index.fn.startDate = 0;
    Index.fn.inLMS = false;
    Index.fn.showFooter = false;
    Index.fn.SCORM = {
        lessonLocation: 1,
        lessonStatus: "incomplete",
        sessionTime: "",
        scoreRaw: 0,
        suspendData: ""
    };

    ///////////////////////////////////////
    // Constructor
    ///////////////////////////////////////
    function Index() {      
        this.SCORM = {
            lessonLocation: 1,
            lessonStatus: "incomplete",
            sessionTime: "",
            scoreRaw: 0,
            suspendData: ""
            //suspendData: "s01_01_01=true;s01_01_02=true;"
        };
        this.showFooter = false;
    }

    ///////////////////////////////////////
    // Start Timer { SCORM }
    ///////////////////////////////////////
    Index.fn.startTimer = function() {
        this.debug("[start_timer]");
        this.startDate = new Date().getTime();      
    };

    ///////////////////////////////////////
    // Compute session time and set to lms { SCORM }
    ///////////////////////////////////////
    Index.fn.computeTime = function() {
        var currentDate = "";
        var elapsedSeconds = "";
        var formattedTime = "";

        if ( this.startDate !== 0 )
        {
            currentDate = new Date().getTime();
            elapsedSeconds = ( (currentDate - this.startDate) / 1000 );
            formattedTime = elapsedSeconds.toString().toHHMMSS();
        }else{
            formattedTime = "00:00:00";
        }

        this.SCORM.sessionTime = formattedTime;

        this.debug("[compute_time ("+this.SCORM.sessionTime+")]");
    };

    ///////////////////////////////////////
    // Initialize { SCORM }
    ///////////////////////////////////////
    Index.fn.initialize = function(){
        var $THIS = this;

        this.inLMS = pipwerks.SCORM.init() ? true : false;

        this.startTimer();

        if(this.inLMS)
        {
            var _lessonLocation = pipwerks.SCORM.get("cmi.core.lesson_location");
            if (_lessonLocation !== null && _lessonLocation !== undefined && _lessonLocation !== "null" && _lessonLocation !== "undefined" && _lessonLocation !== "" && _lessonStatus.length >= 1)
            {               
                this.SCORM.lessonLocation = pipwerks.SCORM.get("cmi.core.lesson_location");
            }else {
                this.SCORM.lessonLocation = "";
            }
            
            var _lessonStatus = pipwerks.SCORM.get("cmi.core.lesson_status");
            if (_lessonStatus !== null && _lessonStatus !== undefined && _lessonStatus !== "null" && _lessonStatus !== "undefined" && _lessonStatus !== "" && _lessonStatus.length >= 1)
            {               
                this.SCORM.lessonStatus = pipwerks.SCORM.get("cmi.core.lesson_status");
            }else {
                this.SCORM.lessonStatus = "";
            }
            
            var _suspendData = pipwerks.SCORM.get("cmi.suspend_data");
            if (_suspendData !== null && _suspendData !== undefined && _suspendData !== "null" && _suspendData !== "undefined" && _suspendData !== "" && _suspendData.length >= 1)
            {               
                this.SCORM.suspendData = pipwerks.SCORM.get("cmi.suspend_data");
            }else {
                this.SCORM.suspendData = "";
            }   
        }

        var wrapper = $("#wrapper").get(0);
        TweenLite.set(wrapper, {opacity:0});
        $("#wrapper").show();
        TweenLite.to(wrapper, 1, {opacity:1, onComplete:function(){
            
        }});

        $(window).on("scroll", function(){            
            revealOnScroll();
            $THIS.checkEnd();
        });
        
        applyAnimations();
    };

    Index.fn.checkEnd = function(){
        var $THIS = this;

        if($THIS.SCORM.lessonStatus != "completed")
        {
            var allPopCompleted = true;
            $('div[data-popup]').each(function(i,e)
            {            
                if($(e).attr("data-complete") != "true")
                {
                    allPopCompleted = false;
                }
            });

            if(!$THIS.showFooter)
            {
                if(isOnScreen($("#footer")))
                {
                    $THIS.showFooter = true;
                    
                }
            }

            if(allPopCompleted && $THIS.showFooter)
            {
                $THIS.endCourse();
            }

        }
    };

    Index.fn.endCourse = function(){
        var $THIS = this == index ? this : window.index;
        if($THIS.SCORM.lessonStatus != "completed")
        {
            $THIS.computeTime();               
            if($THIS.inLMS)
            {
                if($THIS.SCORM.lessonStatus != "completed")
                {
                    $THIS.SCORM.lessonStatus = "completed";
                    pipwerks.SCORM.set("cmi.core.lesson_status", $THIS.SCORM.lessonStatus);    
                    pipwerks.SCORM.save();                    
                }            
            }else{
                if($THIS.SCORM.lessonStatus != "completed")
                {
                    $THIS.SCORM.lessonStatus = "completed";
                }
            }
            console.log("Index.endCourse -> FIM DO CURSO");
        }
    };

    ///////////////////////////////////////
    // GET SUSPEND DATA
    ///////////////////////////////////////
    Index.fn.getSuspendData = function(variable)
    {            
        var output = "";
        var suspendData = this.SCORM.suspendData;
        var startPosition = suspendData.indexOf(variable);
        if(startPosition > -1)
        {
            var endPosition = suspendData.indexOf(";",startPosition) == -1 ? suspendData.length : suspendData.indexOf(";",startPosition);
            var block = suspendData.substr(startPosition,(endPosition - startPosition));
            output = block.split("=")[1];
        }
        this.debug("[get_suspend_data('"+variable+"') = '"+output+"';]");
        return output;
    };
    
    ///////////////////////////////////////
    // SET SUSPEND DATA
    ///////////////////////////////////////
    Index.fn.setSuspendData = function(variable, value)
    {   
        var suspendData = this.SCORM.suspendData;
        var indexInit = suspendData.indexOf(variable);
        if(indexInit <= -1)
        {
            suspendData += suspendData === "" ? (variable+"="+value) : ";"+(variable+"="+value);
        }else{
            var indexEnd = suspendData.indexOf(";",indexInit) <= -1 ? suspendData.length : suspendData.indexOf(";",indexInit);
            var block = suspendData.substr(indexInit, (indexEnd - indexInit));
            suspendData = suspendData.split(block).join((variable+"="+value));      
        }
        this.SCORM.suspendData = suspendData;
        if(this.inLMS)
        {
            pipwerks.SCORM.set("cmi.suspend_data", this.SCORM.suspendData);                
            pipwerks.SCORM.save();
        }        
        this.debug("[set_suspend_data ('"+variable+"' = '"+value+"')]");
    };

    ///////////////////////////////////////
    // CONSOLE SCORM
    ///////////////////////////////////////
    Index.fn.consoleSCORM = function()
    {
        this.debug("-----------------------------------");
        this.debug("cmi.core.session_time");
        this.debug(this.SCORM.sessionTime);
        this.debug("\n");
        this.debug("cmi.suspend_data");
        this.debug(this.SCORM.suspendData);
        this.debug("\n");
        this.debug("cmi.core.lesson_location");
        this.debug(this.SCORM.lessonLocation);
        this.debug("\n");
        this.debug("cmi.core.lesson_status");
        this.debug(this.SCORM.lessonStatus);
        this.debug("-----------------------------------");
    };

    ///////////////////////////////////////
    // UNLOAD COURSE
    ///////////////////////////////////////
    Index.fn.unloadCourse = function(){
        var _this = this;
        this.debug("[unload_course]");
        pipwerks.SCORM.quit();
        setTimeout(function(){
            _this.debug("[fechando a janela]");
            window.parent.close();
            _this.debug("[comando enviado para fechar a janela]");
        },2500);
    };

    ///////////////////////////////////////
    // DEBUG
    ///////////////////////////////////////
    Index.fn.debug = function(msg, type) {
        if (window.console && console.log) {
            type = type === undefined ? "log" : type;
            console[type](msg);
        }
    };

  return Index;

})();