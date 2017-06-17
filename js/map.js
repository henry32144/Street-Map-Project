function initMap() {
        map = new google.maps.Map(document.getElementById("map"),{
        center: {lat: 40.7413549 ,lng: -73.99802439999996},
        zoom: 13,
        fullscreenControl: false,
        });
        var tribeca = {lat: 40.719526, lng: -74.0089934};
        var marker = new google.maps.Marker({
          position: tribeca,
          map: map,
          title: 'First Maker!',
        });
        var infowindow = new google.maps.InfoWindow({
          content: 'DO you eeee...'
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      };    