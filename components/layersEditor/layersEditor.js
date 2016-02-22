/**
 * Created by racheliff on 22/02/2016.
 */
var extensionApp = angular.module('ui-leaflet-layers-editor', ['ui-leaflet']);

extensionApp.component('uiLayersEditor', {
    require: {
        leaflet: '^leaflet'
    },
    controller: function layersEditorCtrl($scope, leafletLogger, leafletData, leafletMapDefaults, leafletHelpers) {
        var leafletScope;
        var vm = this;

        vm.$onInit = function() {
            leafletScope = this.leaflet.getLeafletScope();
            vm.leaflet.getMap().then(function(map) {

                var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});//,

                var defaults = leafletMapDefaults.getDefaults();
                var tileLayerObj = L.layerGroup([osm]);
                tileLayerObj.addTo(map);

                leafletData.setTiles(tileLayerObj);

                var drawnItems = new L.FeatureGroup();
                map.addLayer(drawnItems);

                // Set the title to show on the polygon button
                //L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';

                var drawControl = new L.Control.Draw({
                    position: 'topright',
                    draw: {
                        polyline: {
                            metric: true
                        },
                        polygon: {
                            allowIntersection: false,
                            showArea: true,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            },
                            shapeOptions: {
                                color: '#bada55'
                            }
                        },
                        circle: {
                            shapeOptions: {
                                color: '#662d91'
                            }
                        },
                        marker: true
                    },
                    edit: {
                        featureGroup: drawnItems,
                        remove: true
                    }
                });
                map.addControl(drawControl);

                map.on('draw:created', function (e) {
                    var type = e.layerType,
                        layer = e.layer;

                    if (type === 'marker') {
                        layer.bindPopup('A popup!');
                    }

                    drawnItems.addLayer(layer);
                });

                map.on('draw:edited', function (e) {
                    var layers = e.layers;
                    var countOfEditedLayers = 0;
                    layers.eachLayer(function(layer) {
                        countOfEditedLayers++;
                    });
                    console.log("Edited " + countOfEditedLayers + " layers");
                });

                /*  L.DomUtil.get('changeColor').onclick = function () {
                drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#004a80' } } });
                };*/
                // get the map's defaults
                var defaults = leafletMapDefaults.getDefaults();

                leafletScope.$on('$destroy', function(){
                    map = null;
                    controller.switchTile = null;
                });
            });
        };
    },
    controllerAs: 'layersEditorCtrl'
});
