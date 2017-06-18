var map;
//create blank markers array
var markers = [];
//create defaultPLace to display when the geolocation is not work
var defaultPlace;
//create blank infoWindow
var infowindow;
//create google place api service variable
var service;
//check if markers is ready to use
var markersReady = false;

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

      //Try to get user's current location
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
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
          createMarker(results[i]);
        }
    }
    else alert('Maybe there is no Sushi Around you!');
}

//this function create marker and fill in information in it
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
    });

    markers.push(marker);

    if(markers.length >= 19) {
      markersReady = true;
    }

    google.maps.event.addListener(marker, 'click', function() {
      setInfoContent(this);
      toggleBounce(this);
    });
}

function setInfoContent(marker) {
    infowindow.setContent(marker.title);
    infowindow.open(map, marker);
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

function openInfo(marker) {
  toggleBounce(marker);
  setInfoContent(marker);
}