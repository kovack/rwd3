/**
 * The nav stuff
 */
(function( window ){
	
	'use strict';

	//var lijeviactive = false;
	//var desniactive = false;


	var body = document.body,
		mask = document.createElement("div"),
		toggleSlideLeft = document.querySelector( ".toggle-slide-left" ),
		toggleSlideRight = document.querySelector( ".toggle-slide-right" ),
		activeNav
        //lijeviactive,
        //desniactive
	;
	mask.className = "mask";
	//lijeviactive = false;
	//desniactive = false;

	/* slide menu left */
	toggleSlideLeft.addEventListener("click", function () {

	    var str = body.className;

	    if (str.indexOf("sml-open") == -1) {
	        classie.add(body, "sml-open");
	        //document.body.appendChild(mask);
	        //activeNav = "sml-open";
	        //lijeviactive = true;
	    }
	    else {
	        classie.remove(body, "sml-open");
	        //document.body.removeChild(mask);
	        //lijeviactive = false;
	    }

		//classie.add( body, "sml-open" );
		//document.body.appendChild(mask);
		//activeNav = "sml-open";
		//lijeviactive = true;
	} );

	/* slide menu right */
	toggleSlideRight.addEventListener("click", function () {

	    var str = body.className;
        
	    if (str.indexOf("smr-open") == -1) {

	        classie.add(body, "smr-open");
	        //document.body.appendChild(mask);
	        //activeNav = "smr-open";
	        //var desniactive = true;

	    }
	    else {
	        classie.remove(body, "smr-open");
	        //document.body.removeChild(mask);
	        //desniactive = false;
	    }


		//classie.add( body, "smr-open" );
		//document.body.appendChild(mask);
		//activeNav = "smr-open";
		//var desniactive = true;
	} );


	/* hide active menu if close menu button is clicked */
	//[].slice.call(document.querySelectorAll(".close-menu")).forEach(function(el,i){
	//	el.addEventListener( "click", function(){
	//	    classie.remove(body, activeNav);
	//	    if (activeNav == "sml-open") {
	//	        lijeviactive = false;
	//	        if (desniactive == true) {
	//	            activeNav = "smr-open";
	//	        }
	//	        else {
	//	            activeNav = "";
	//	        }
	//	    }

	//	    if (activeNav == "smr-open") {
	//	        desniactive = false;
	//	        if (lijeviactive == true) {
	//	            activeNav = "sml-open";
	//	        }
	//	        else {
	//	            activeNav = "";
	//	        }
	//	    }
			
	//		document.body.removeChild(mask);
	//	} );
	//});


})( window );