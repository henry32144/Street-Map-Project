var map;
var defaultPlace;
var infowindow;
var service;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.050302, lng: 121.531105},
        zoom: 13,
        fullscreenControl: false,
        mapTypeControl: false
      });

      defaultPlace = new google.maps.LatLng({lat: 25.050302, lng: 121.531105});

      service = new google.maps.places.PlacesService(map);

      infowindow = new google.maps.InfoWindow();

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

function getSearch(pos) {
    service.nearbySearch({
    location: pos,
    radius: 1000,
    keyword: '壽司',
    type: ['restaurant']
  }, callback);
}

function handleLocationError(browserHasGeolocation) {
    alert(browserHasGeolocation ?
                        'Error: The Geolocation service failed. Display default locations' :
                        'Error: Your browser doesn\'t support geolocation.');
    map.setCenter(defaultPlace);
    getSearch(defaultPlace);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        saveStoreList(results);
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
    }
    else alert('Maybe there is no Sushi Around you!');
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
}