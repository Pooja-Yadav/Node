exprots.home = function (req, res) {
    var tp = function () {
        var map;
        var poly;
        var sa = JSON.parse(!JSON.stringify(products));

        function initialize() {
            var mapOptions = {
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById('MapDiv'),
                mapOptions);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {

<<<<<<< .mine
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
=======
            var infowindow = new google.maps.InfoWindow({
                content: '<br>Your Location<br>',
                maxWidth: 200
            });
>>>>>>> .r27

                    var infowindow = new google.maps.InfoWindow({
                        content: '<h1>Your Location<br>',
                        maxWidth: 200
                    });

                    var places = [];
                    for (var i = 0; i < sa.length; i++) {
                        places.push(new google.maps.LatLng(sa[i].LatLng.latitude, sa[i].LatLng.longitude));
                    }
                    for (var i = 0; i < places.length; i++) {

                        var markerPlaces = new google.maps.Marker({
                            position: places[i],
                            map: map,
                            title: 'Place number ' + i
                        });
                    }
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: 'Location'
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
                    map.setCenter(pos);
                    var polyOptions = {
                        strokeColor: '#000000',
                        strokeOpacity: 1.0,
                        strokeWeight: 3,
                        map: map
                    };
                    poly = new google.maps.Polyline(polyOptions);

                    // Add a listener for the click event
                    google.maps.event.addListener(map, 'click', addLatLng);
                }, function () {
                    handleNoGeolocation(true);
                });
            }
            else {
                handleNoGeolocation(false);
            }
        }

        function addLatLng(event) {
            var path = poly.getPath();
            // Because path is an MVCArray, we can simply append a new coordinate
            // and it will automatically appear
            path.push(event.latLng);

            console.log(event.latLng);
        }

        function handleNoGeolocation(errorFlag) {
            if (errorFlag) {
                var content = 'Error: The Geolocation service failed.';
            } else {
                var content = 'Error: Your browser doesn\'t support geolocation.';
            }

            var options = {
                map: map,
                position: new google.maps.LatLng(60, 105),
                content: content
            };

            var infowindow = new google.maps.InfoWindow(options);
            map.setCenter(options.position);
        }

        function loadScript() {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
                'callback=initialize&libraries=geometry&libraries=places';
            document.body.appendChild(script);
        }

        loadScript;
    }
}