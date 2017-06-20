var map;
//create blank markers array
var markers = [];
//create defaultPLace to display when the geolocation is not work
var defaultPlace;
//create position latlng;
var posLatLng;
//create blank infoWindow
var infowindow;
//create google place api service variable
var service;
//check if markers is ready to use
var markersReady = false;
//create facebook content array to store the ajax information
var fbContent = [];

var haveAlert = false;

var defaultIcon;

var highlightedIcon;

//this function is to generate map , it will called when the api is loaded.
function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.050302, lng: 121.531105},
        zoom: 14,
        fullscreenControl: false,
        mapTypeControl: false
      });

      //initialize defalutPLace the location is in Taipei
      defaultPlace = new google.maps.LatLng({lat: 25.050302, lng: 121.531105});

      service = new google.maps.places.PlacesService(map);

      infowindow = new google.maps.InfoWindow();

      defaultIcon = makeMarkerIcon('f75c50');

      highlightedIcon = makeMarkerIcon('FFFF24');

      //Try to get user's current location
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          posLatLng = pos;
          map.setCenter(pos);
          getSearch(pos);
        }, function() {
          handleLocationError(true);
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
      }
}

//this function handle errors about user's location 
function handleLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation ?
                        'Error: The Geolocation service failed. Display default locations' :
                        'Error: Your browser doesn\'t support geolocation.');
    posLatLng = {lat: 25.050302, lng: 121.531105};
    map.setCenter(defaultPlace);
    getSearch(defaultPlace);
}

//this function try to get sushi restaurant around
//the location , used google place api
function getSearch(pos) {
    service.nearbySearch({
    location: pos,
    radius: 1000,
    keyword: "(壽司) OR (寿司)",
    type: ['restaurant']
  }, callback);
}


//this function generate marker when getSearch is done and
//send results to saveStoreList for knockout model 
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        //save results for model
        saveStoreList(results);
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i],i);
          getFbContent(results[i],i);
        }
    }
    else alert('Maybe there is no Sushi Around you!');
}

function getFbContent(place,index) {

  var name = place.name;
  var centerStr = posLatLng.lat + "," + posLatLng.lng; 
  var apiId = "2312757352283570|b46b74813f5c39ddeb7e34668318e1ce";
  var url = "https://graph.facebook.com/v2.9/search?type=place&q=" + name + "&center=" + centerStr + "&distance=1000&fields=name,price_range,link,description&access_token=" + apiId;

  $.getJSON(url , function(data){
      fbContent[index] = data;
  }).fail(function(e){
      if(haveAlert == false)
      {
       alert('failed to get data from Facebook');
       haveAlert = true;
      }
  });
}

//this function create marker and fill in information
function createMarker(place , label) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        title: label.toString(),
        id: place.place_id,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
    });

    markers.push(marker);

    if(markers.length > 19) {
      markersReady = true;
    }

    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });

    marker.addListener('click', function() {
      setInfoContent(this,parseInt(this.title));
      toggleBounce(this);
    });
}

function setInfoContent(marker,index) {
    //check fbcontent is ready to go
    console.log(index);
    var hasFbContent;
    if (fbContent.length > 19) {
        if (fbContent[index].data.length > 0) {
        hasFbContent = true;
      }
    }
    
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId: marker.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Set the marker property on this infowindow so it isn't created again.
        infowindow.marker = marker;
        var innerHTML = '<div>';
        if (place.name) {
          innerHTML += '<strong>' + place.name + '</strong>';
        }
        if (place.formatted_address) {
          innerHTML += '<br>' + place.formatted_address;
        }
        if (place.formatted_phone_number) {
          innerHTML += '<br>' + place.formatted_phone_number;
        }
        if (hasFbContent && fbContent[index].data[0].link) {
          innerHTML += '<br><br><a href="' + fbContent[index].data[0].link + '">' + '商家Facebook' + '</a>';
        }
        if (hasFbContent && fbContent[index].data[0].price_range) {
          innerHTML += '<br><br>Price: about or above ' + 10*((2^fbContent[index].data[0].price_range.length)+1) +' USD';
        }
        if (place.rating) {
          innerHTML += '<br><br>Rating:  ' + place.rating + '/5';
        }
        if (hasFbContent && fbContent[index].data[0].description) {
          innerHTML += '<br><br>Description: ' + fbContent[index].data[0].description;
        }
        if (place.opening_hours) {
          innerHTML += '<br><br><strong>Hours:</strong><br>' +
              place.opening_hours.weekday_text[0] + '<br>' +
              place.opening_hours.weekday_text[1] + '<br>' +
              place.opening_hours.weekday_text[2] + '<br>' +
              place.opening_hours.weekday_text[3] + '<br>' +
              place.opening_hours.weekday_text[4] + '<br>' +
              place.opening_hours.weekday_text[5] + '<br>' +
              place.opening_hours.weekday_text[6];
        }
        if (place.photos) {
          innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    });
}


//this function switch marker's bounce event
//it will toggle off every other marker's animation
//make sure there is only one marker is bouncing.
function toggleBounce(marker) {
  for(var i = 0;i < markers.length;i ++){
    markers[i].setAnimation(null);
  }
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function showMarker(index) {
  markers[index].setMap(map);
}

function hideMarker(index) {
  markers[index].setMap(null);
}

function openInfo(marker,index) {
  toggleBounce(marker);
  setInfoContent(marker,index);
}



// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}