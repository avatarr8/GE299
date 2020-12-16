var map;

function getColor(p) {
		return p > .5  ? '#dd1c77' :  //greater than 50%
				  // p >= .4  ? '#c51b8a' : //greater than 40%
				   p > .3  ? '#f7f7f7' : //greater than 30%
					// p >= .2  ? '#fbb4b9' : //greater than 20%
				   p > .1  ? '#67a9cf' : //greater than 10%
					 						'#FFFFFF'; //fall back value
}

//function to instantiate the Leaflet map
function createMap(){

    //create the map
    map = L.map('mapid2', {
        center: [42.27,-71.8023],
        zoom:12
    });

    //add  base tilelayer
		var myBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
});

		myBasemap.addTo(map);

    //call getData function
    getData(map);

    //create legend
    var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [10, 30, 50],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor((grades[i]+1)/100) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(map);

};



//function to retrieve the data and place it on the map
function getData(map){

//because we are creating a choropleth map, we set the color with a function
  function myStyle(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'silver',
      dashArray: '5',
      fillOpacity: .5,
      //this equation uses the "getColor" function above to set the color based on the difference between votes divided by those cast
     fillColor: getColor((feature.properties.registered-feature.properties.cast_total)/feature.properties.registered)

// fillColor: getColor((feature.properties.trump-feature.properties.biden)/feature.properties.cast_total)
		};
  }

  //load the data, then map
    $.getJSON("data/worcElection20.geojson", function(response){

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
									style: myStyle
            }).addTo(map);
    });
};


$(document).ready(createMap);
