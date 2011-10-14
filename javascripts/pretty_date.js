function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;
			
	return day_diff == 0 && (
			diff < 60 && "il y a moins d'une minute" ||
			diff < 120 && "il y a une minute" ||
			diff < 3600 && "il y a " + Math.floor( diff / 60 ) + " minutes" ||
			diff < 7200 && "il y a une heure" ||
			diff < 86400 && "il y a " + Math.floor( diff / 3600 ) + " heures") ||
		day_diff == 1 && "Hier" ||
		day_diff < 7 && "il y a " + day_diff + " jours" ||
		day_diff < 31 && "il y a " + Math.ceil( day_diff / 7 ) + " semaines";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" )
	jQuery.fn.prettyDate = function(){
		return this.each(function(){
			var date = prettyDate(this.title);
			if ( date )
				jQuery(this).text( date );
		});
	};
