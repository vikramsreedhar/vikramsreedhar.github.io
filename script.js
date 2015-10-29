var stickyNav;

$(document).ready(function(){

	//applyPreloader();
	//randomFeature();

$('.nav .dropdown').hover(function() {
        $(this).addClass('open');
    }, function() {
        $(this).removeClass('open');
    });

  
	applyHeader();
	applyNavigation(); 
	applyMailTo();
	applyResize();
	checkHash();
});

/* Preloader Function */
function applyPreloader() {
	$('.containloader').delay(2000).fadeOut(1000);
}

function randomFeature() {
	function moveClouds(e, s, d) {
    $(e).css('right', '-20%');
        var wait = window.setTimeout(function(){
            $(e).animate ({
                right: '120%'
            }, s, 'linear', function() {
            moveClouds(e, s, d);
        });
    },d);
}

if(!Modernizr.cssanimations) {
    var clouds = [1,2,3,4];
		    
    $.each(clouds, function() {
        var e = $('.cloud-' + this);
        moveClouds(e, e.data('speed'), e.data('delay'));
    });
}

}

/* Header Function */
function applyHeader() {
	$('.jumbotron').css({ height: ($(window).height()) +'px' });
}	

/* Navigation Functions */
function applyNavigation() {
	forClicking();
	scrollSpy();
	stickyNavigation();
}

function forClicking(){
	$('a[href*=#]').on('click', function(e) {
		e.preventDefault();

		if( $( $.attr(this, 'href') ).length > 0 ) {
			$('html, body').animate({
				scrollTop: $( $.attr(this, 'href') ).offset().top
			}, 400);
		}

		return false;
	});
}

function scrollSpy() {
	$('#navbar').on('activate.bs.scrollspy', function() {
		window.location.hash = $('.nav .active a').attr('href').replace('#', '#/');
	});
}

function stickyNavigation() {
	stickyNav = $('.scroll-down').offset().top + 20;
	$(window).on('scroll', function() {  
		stickyNavigation();  
	});  
	stickyNavigation();
}

function stickyNavigation() {         
	if($(window).scrollTop() > stickyNav) {   
		$('body').addClass('fixed');  
	} else {  
		$('body').removeClass('fixed');   
	}  
}


Parse.initialize("4EKumHrtgH5GtrGswrjWCQVDrKRCcdihxaG006eo", "OEhXvtCNHGIjsEQOfRFdk6RZUJ8A2CW0nzHxKfu9");
var map;
var myLatLng = {};
var found = false;
function initMap() {
  //Load map based on geolocation or default to Berkeley
  //var myLatLng;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      found = true;
      map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 15
      });
      addMarkers();
    })
  } if (!found) {
    myLatLng = {lat: 37.869749, lng: -122.261953};
    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 15
    });
    addMarkers();
  }
  $('#submit').on('click', function(e) {
    var x = document.getElementById("form1");
    var name = x.elements["name"].value;
    var artist = x.elements["artist"].value;
    var file_name = x.elements["song"].value;

    e.preventDefault();
    if (name === '' || artist === '' || file_name === '') {
      alert('Please fill out both fields.');
      return;
    }
    var marker1 = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: 'img/fire.png'
    });
    marker1.setMap(map);
    var fileUploadControl = $("#audio")[0];
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var song_name = "song.mp3";

      var parseFile = new Parse.File(song_name, file);
      parseFile.save().then(function() {
      // The file has been saved to Parse.
      }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
        alert('Could not upload song file.');
          });
    }

    $('#songname').val('');
    $('#artistname').val('');
    $('#audio').val('');
    var marker1_mess = ""
    var MarkerObject = Parse.Object.extend("MarkerObject");
    var newMarker = new MarkerObject();
    newMarker.set("position", myLatLng);
    newMarker.set("artist", artist);
    newMarker.set("song", name);
    newMarker.set("audio", parseFile);
    newMarker.set("likes", 0);
    newMarker.set("dislikes", 0);
    newMarker.save(null, {
      success: function(newMarker) {
        alert('Successfully added marker!');
        marker1_mess = '<h2>Song: ' + newMarker.get('song') + '</h2>' + '<h2>Artist: ' + newMarker.get('artist') + '</h2>' +
    '<h1><audio controls><source src = ' + newMarker.get('audio').url() + ' type = "audio/mp3"></audio></h1><p>' + '0&nbsp&nbsp&nbsp' +'<a id="likes" onclick="like(1);">Like&nbsp&nbsp&nbsp</a></p><p>' + 
    '0&nbsp&nbsp&nbsp' + '<a id="dislikes" onclick="like(-1);">Dislike</a></p>';
    
      attachSecretMessage(marker1, marker1_mess);
      },
      error: function(newMarker, error) {
        alert('Failed to add marker!');
      }

    })
    console.log(newMarker.get('audio'))


  });
}

function like(amount) {
  if (amount == -1) {
    curr_marker.markerobject.increment("dislikes", -1);
    curr_marker.markerobject.save();
    alert("Disliked!");
  } else {
    curr_marker.markerobject.increment("likes", 1);
    curr_marker.markerobject.save();
    alert("Liked!");
  }
}

function addMarkers() {
  var MarkerObject = Parse.Object.extend("MarkerObject");
  var queryMarker = new Parse.Query(MarkerObject);

  queryMarker.find({
    success: function (results) {
      for (var i = 0; i < results.length; i++) {
        var temp_MarkerObject = results[i];
        var temp_mark = new google.maps.Marker({
        position: temp_MarkerObject.get('position'),
        map: map,
        icon: 'img/fire.png',
        markerobject: temp_MarkerObject
        });
        temp_mark.setMap(map);
        var secret = '<h2>Song: ' + temp_MarkerObject.get('song') + '</h2>' + '<h2>Artist: ' + temp_MarkerObject.get('artist') + '</h2>' +
    '<h1><audio controls><source src = ' + temp_MarkerObject.get('audio').url() + ' type = "audio/mp3"></audio></h1><p>' + temp_MarkerObject.get('likes') 
    + '&nbsp&nbsp&nbsp' + '<a id="likes" onclick="like(1);">Like&nbsp&nbsp&nbsp</a></p><p>'+ temp_MarkerObject.get('dislikes') + '&nbsp&nbsp&nbsp' + '<a id="dislikes" onclick="like(-1);">Dislike</a></p>';
        attachSecretMessage(temp_mark, secret);
      }
    },
    error: function(error) {
      alert("Could not fetch data!");
    }
  });
}

  // Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
var curr_marker = null;
function attachSecretMessage(marker, secretMessage) {
  marker.infowindow = new google.maps.InfoWindow({
    content: secretMessage
  });

marker.addListener('click', function() {
  if (curr_marker == null) {
    marker.infowindow.open(marker.get('map'), marker);
    curr_marker = marker;
  } else if (curr_marker != null) {
    curr_marker.infowindow.close(curr_marker.get('map'), curr_marker);
    marker.infowindow.open(marker.get('map'), marker);
    curr_marker = marker;
  }
});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent(browserHasGeolocation ?
  'Error: The Geolocation service failed.' :
  'Error: Your browser doesn\'t support geolocation.');

}




/* Resize Function */
function applyResize() {
	$(window).on('resize', function() {  
		stickyNav = $('.scroll-down').offset().top + 20;
		$('.jumbotron').css({ height: ($(window).height()) +'px' });
	}); 
}

/* Hash Function */
function checkHash() {
	lstrHash = window.location.hash.replace('#/', '#');
	if($('a[href='+ lstrHash +']').length > 0) {
		$('a[href='+ lstrHash +']').trigger('click');
	}
}