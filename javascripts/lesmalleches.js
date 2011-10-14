function main_load() {
}

function show_calendar(root) {	
	// Extract info
	var infos = [];

	$.each(root.feed.entry, function(i,entry){
		var info = {};
		info['title'] = entry.title.$t;
		
		// Date
		var start = (entry['gd$when']) ? entry['gd$when'][0].startTime : "";
		var date = start.match(/(\d{4,})-(\d{2,})-(\d{2,})/);
		info['date'] = null;
				
		if (date) {
			info['date'] = {};
			info['date']['month'] = parseInt(date[2], 10);
			info['date']['day'] = parseInt(date[3], 10);
		}
		
		// Time
		var time = start.match(/T(\d{2,}):(\d{2,}):(\d{2,})/);		
		info['time'] = null;
		
		if (time) {
			info['time'] = {};
			info['time']['hour'] = time[1];
			info['time']['minutes'] = time[2];
		}
		
		// Where
		info['where'] = {};
		var where = entry.gd$where[0].valueString;
		info['where']['complete'] = where;
		
		var wheres = where.split(/,/);
		if (wheres.length == 4) {
			info['where']['city'] = wheres[1];
		}
		
		infos.push(info);
	});
	
	// Show info
	$.each(infos, function(i, info) {
		$("#calendar").append('<tr class="' + (i%2==0 ? 'even' : 'odd') + '">' + 
				// Date
				'<td>' +
					(info['date'] ? 
						info['date']['day'] + ' ' + 
						["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][info['date']['month']-1]
				 	: '&nbsp;') +
				'</td>' +
				
				// Title
				'<td>' + info['title'] + '</td>' + 				
				
				// Time
				'<td>' +
					(info['time'] ? 
						info['time']['hour'] + 'h' +  info['time']['minutes']
				 	: '&nbsp;') +
				'</td>' +
				
				// Ville
				'<td>' +
					(info['where']['city'] ? 
						info['where']['city'] + '</a>'
				 		: info['where']['complete']) +
				 '</td>' +
				 
				 '<td>' +
				 	(info['where']['city'] ?
				 		'<a href="http://maps.google.ca/maps?hl=fr&q=' + 
							escape(info['where']['complete']) + 
							'" target="_blank">carte</a>'
						: '') + 
				'</td>' +
			'</tr>'
		);
	});
}

function index_load() {
	// Highlight name
	var highlightName = function(params) {
		var elem =params["element"];
		if (params["cadre"]) {
			var re = /cadre\_([a-z]+)/i;
			var m = re.exec(params["cadre"].attr("id"))[1];
			elem = $("#"+m);
		}
		
		if (elem)
			elem
				.css({ backgroundColor:"yellow"})
				.animate({ backgroundColor:"#000"}, 1000)
	}

	// Afficher l'encadré sur l'image
	$(".cadre").hover(
		function() {
			$(this).toggleClass("border");
			highlightName({cadre:$(this)});
		},
		function() {
			$(this).toggleClass("border");
		}
	);
	
	// Afficher l'encadré à partir du lien
	$("#membres a").hover(
		function() {
			$("#photo_membres #cadre_" + this.id).addClass("border");
			highlightName({element:$(this)});
		},
		function() {
			$("#photo_membres #cadre_" + this.id).removeClass("border");
		}
	);
	
	// Sur le clique, simuler un clique sur le lien
	$(".cadre").click(
		function() {
			var re = /cadre\_([a-z]+)/i;
			var m = re.exec(this.id)[1];
			location = $("#membres a#" + m)[0].href;
		}
	);
	
	// Afficher 8 photos
	showPhotos();
	
	// Afficher le reste des photos
	$("#photos #show_all").click(function() {
		$(this).hide();
		showPhotos(500);
	});
}

function showPhotos(nbr) {
	nbr |= 8;
	
	$("#album a").remove();
	
	$.getJSON(
		"http://api.flickr.com/services/rest/?jsoncallback=?",
		{ method : "flickr.photos.search",
            api_key : "b89c532ba8e26c1150bbdc2f0bc1f717",
            format : "json",
            tags : "lesmalleches",
            per_page: nbr,
            page: 1

		},
		function(data) {			
			$.each(data.photos.photo, function() {
				var url = ["http://farm", this.farm, ".static.flickr.com/",
					this.server, "/", this.id, "_", this.secret]
				$("#album")
					.append(
						$("<a>")
							.attr("rel", "album")
							.attr("href", url.concat([".jpg"]).join(""))
							.append(
								$("<img>").attr("src",  url.concat(["_s.jpg"]).join(""))
							)
							.fancybox({
								zoomOpacity			: true,
								overlayShow			: false,
								zoomSpeedIn			: 500,
								zoomSpeedOut			: 500,
								hideOnContentClick: true
							})
					)
			});
		}
	);
}

function highlight_index() {
	if (document.location.hash) {
		var div = $("#" + document.location.hash.substring(1));
		div.css({ backgroundColor : "yellow" })
			.animate({ backgroundColor: "#fff" }, 3000)
	}
}

function members_load() {
	if (document.location.hash) {
		var div = $("#_" + document.location.hash.substring(1));
		$("html, body").animate({scrollTop:div[0].offsetTop}, "slow");
		div.css({ backgroundColor : "yellow" })
			.animate({ backgroundColor: "#000" }, 3000, function() {
				$(this).css("backgroundColor", "transparent");
			})
	}
}
