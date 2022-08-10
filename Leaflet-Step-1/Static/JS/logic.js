// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL

d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {
  
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) { 
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p><strong>Magnitude: " + feature.properties.mag + "<br>Recorded on: </strong>" + new Date(feature.properties.time) + "</p>");
  }

  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: circleRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // function getColor(mag) {
  //   switch (true) {
  //     case mag > 5:
  //       return "#ea2c2c";
  //     case mag > 4:
  //       return "#eaa92c";
  //     case mag > 3:
  //       return "#d5ea2c";
  //     case mag > 2:
  //       return "#92ea2c";
  //     case mag > 1:
  //       return "#2ceabf";
  //     default:
  //       return "#2c99ea";
  //   }
  // }

  function getColor(mag) {
    return mag > 5 ? '#FF0000' :
           mag > 4 ? '#FF6347' :
           mag > 3 ? '#FF8C00' :
           mag > 2 ? '#FFD700' :
           mag > 1 ? '#ADFF2F' :
           mag > 0 ? '#9ACD32' :
                     '#FFD700';
}
 
  function circleRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 3 ;
  }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,
    onEachFeature: onEachFeature
  });

  
  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });




  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    zoomSnap: 0.25,
    center: [
      38.7783, -100.4179
    ],
    zoom: 5,

    layers: [lightmap, earthquakes]
    
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
        grades = [0, 1, 2, 3, 4, 5];
        labels = [];
  
  // Setup map legend
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;

  };

  legend.addTo(myMap)
}
