var map;
var geodata = "data/worcElection20.geojson"
var mapdivs = ["biden","trump"];
var breaks = [
		[.5, '#03254c'],
		[.4, '#1167b1'],
		[.3, '#2a9df4'],
		[.2, '#89cff0']
];
var labels = breaks.map((x)=>x); //this makes a copy of the breaks array that can be easily reversed for the labels
labels.reverse();

function getColor(p) {
	fcolor = '#FFFFFF'; //set the feature color to white by default
	for (index = 0; index < breaks.length; index++) { //go through however many breaks there are
		if (p >= breaks[index][0]) { //if the result is above a break threshold, set the color and stop
			fcolor = breaks[index][1];
    	break;
		}
	}
	return fcolor;
}

//because we are creating a choropleth map, we set the color with a function
function myStyle(feature) {
	//Here we set the equation to calculate what data each choropleth is showing
	//the cases should match the mapdivs array above, which matches the IDs of divs in the HTML
	//more math might be needed to get the output to fit in the breaks
	//see for example Math.abs() here: https://www.w3schools.com/js/js_math.asp

		switch (divcase) { //divcase is a variable set in the onEach function in the createMap function
			case "biden":
				result = (feature.properties.biden-feature.properties.trump)/feature.properties.cast_total
				break;

			case "trump":
				result = (feature.properties.biden-feature.properties.trump)/feature.properties.cast_total
				break;

			default:
				result = (feature.properties.biden-feature.properties.trump)/feature.properties.cast_total
		}

    return {
      weight: 2,
      opacity: 1,
      color: 'silver',
      dashArray: '5',
      fillOpacity: .5,
		  fillColor: getColor(result)
			};
  }//end of myStyle

/*------------------------------------------------------------------------------------*/
/*-------------- YOU SHOULD NOT HAVE TO EDIT CODE BELOW HERE to change the map--------*/
/*------------------------------------------------------------------------------------*/

//function to instantiate the Leaflet map
function createMap(){
	$.getJSON(geodata, function(response){

		mapdivs.forEach((mapdiv, i) => { //adds a map for each div listed in mapdivs array above

	    //create the map
	    map = L.map(mapdiv, {
	        center: [42.27,-71.8023],
	        zoom:12
	    });

	    //add  base tilelayer
			var myBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
					maxZoom: 16
					});

			myBasemap.addTo(map);

			//create a Leaflet GeoJSON layer and add it to the map
			divcase = mapdiv;
			L.geoJson(response, {
						style: myStyle
			}).addTo(map);

	    //call getData function
	    //getData(map);

	    //create legend
	    var legend = L.control({position: 'bottomright'});
	        legend.onAdd = function (map) {

	            var div = L.DomUtil.create('div', 'info legend');

	            // loop through our density intervals and generate a label with a colored square for each interval
	            for (var i = 0; i < breaks.length; i++) {
	                div.innerHTML +=
	                   // '<i style="background:' + getColor((grades[i]+1)/100) + '"></i> ' +
										 '<i style="background:' + labels[i][1] + '"></i>' +
	                   //grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
										 labels[i][0]*100 + (labels[i + 1] ? '&ndash;' + labels[i + 1][0]*100 + '<br>' : '+');
	            }

	            return div;
	        };
	        legend.addTo(map);
		}); //end of mapdivs foreach
	});//end of $.getJSON
}; //end of createmap()

$(document).ready(createMap);
