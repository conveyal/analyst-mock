'use strict';

// Basic test of one-to-many profile routing served up at http://localhost:8080/profile_analyst_tester.html
// Or access using a file:// URL to allow modifying this client while using a running OTP server.
// When you move the marker, a request is sent to OTP profile router in one-to-many mode.

var map = L.map('map');

L.tileLayer('https://b.tiles.mapbox.com/v3/conveyal.hp092m0g/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.setView([48.295, 4.055], 13);

L.marker([48.28898, 4.03464], {draggable: true}).addTo(map);

var worstFeature, avgFeature, bestFeature;

// Copied from QGIS natural breaks
var breaks = [24, 62, 116, 192, 292, 454, 631, 1203]

// http://colorbrewer2.org export
var colors = ['rgb(247,251,255)','rgb(222,235,247)','rgb(198,219,239)','rgb(158,202,225)','rgb(107,174,214)','rgb(66,146,198)','rgb(33,113,181)','rgb(8,69,148)'];
colors = ['rgb(255,247,236)','rgb(254,232,200)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(153,0,0)'];

function color(pop) {
    for (var i = 0; i < breaks.length; i++) { 
        if (pop < breaks[i]) return colors[i];
    }    
}

function style(feature) {
    return {
        fillColor: color(feature.properties.people),
        fillOpacity: 0.4,
        stroke: false
    };
}

$.getJSON("troyes-pop.geojson", function (json) {
    L.geoJson(json, {style: style}).addTo(map);
});

$.getJSON("troyes.geojson", function (json) {
    var minStyle = {
        "color": "#101010",
        "weight": 1,
        "stroke": true,
        "fill": false,
        "fill-opacity": 0.05,
        "opacity": 0.50,
        "dashArray": [3, 5]
    };
    var avgStyle = {
        "color": "#101010",
        "weight": 1,
        "stroke": true,
        "fill": false,
        "fill-opacity": 0.05,
        "opacity": 0.50
    };
    var maxStyle = {
        "color": "#101010",
        "weight": 1,
        "stroke": true,
        "opacity": 0.5,
        "fill-opacity": 0.05,
        "fill": false,
        "dashArray": [3, 5]
    };
    L.geoJson(json.isochrones.pointEstimate.features[18], {style: avgStyle}).addTo(map);
    L.geoJson(json.isochrones.worstCase.features[18], {style: minStyle}).addTo(map);
    L.geoJson(json.isochrones.bestCase.features[18], {style: maxStyle}).addTo(map);
});

