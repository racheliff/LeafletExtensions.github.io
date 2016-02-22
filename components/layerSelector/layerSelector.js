var extensionApp = angular.module('ui-leaflet-layers-selector', ['ui-leaflet']);

extensionApp.component('uiLeafletLayersSelector', {
    templateUrl: 'components/layerSelector/index.tmpl.html',
    bindings: {
        tilesList: '=',
        defaultTile: "=",
        chineseProvidersTilesList: "="
    },
    require: {
        leaflet: '^leaflet'
    },
    controller: function layerSelectorCtrl($scope, leafletLogger, leafletData, leafletMapDefaults, leafletHelpers) {
        var leafletScope;
        var vm = this;
        vm.unionLayers = _.concat(vm.tilesList, vm.chineseProvidersTilesList);
        vm.openLayersList = function(e){
            vm.show = !vm.show;
            //alert('1')
        };

        vm.$onInit = function() {
            leafletScope = this.leaflet.getLeafletScope();
            vm.leaflet.getMap().then(function(map) {

                map.on('click', function(e){
                  /*  if(vm.show == true)
                        vm.show = false;*/
                });
                var tileLayerObj;
                // get the map's defaults
                var defaults = leafletMapDefaults.getDefaults();

                var tiles = vm.unionLayers[vm.defaultTile];

                /**
                 * @name switchTile
                 * @description allows to switch tile on click
                 * @param tiles
                 */
                vm.switchTile = function switchTile(tiles){

                    // gets the map's tileLayerOptions
                    var tileLayerOptions = defaults.tileLayerOptions;
                    // gets the map's tileLayerUrl
                    var tileLayerUrl = defaults.tileLayer;
                    var layertMap, layerAnnotion, layerGroup;

                    vm.show = false;
                    vm.currentTile = tiles.name;

                    if(tiles.hasOwnProperty("url")){

                        // If no valid tiles are in the scope, remove the last layer
                        if (!angular.isDefined(tiles.url) && angular.isDefined(tileLayerObj)) {
                            map.removeLayer(tileLayerObj);
                            return;
                        }

                        // No leafletTiles object defined yet
                        if (!angular.isDefined(tileLayerObj)) {
                            if (angular.isDefined(tiles.options)) {
                                angular.copy(tiles.options, tileLayerOptions);
                            }

                            if (angular.isDefined(tiles.url)) {
                                tileLayerUrl = tiles.url;
                            }

                            tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                            tileLayerObj.addTo(map);
                            leafletData.setTiles(tileLayerObj);
                            return;
                        }

                        // If the options of the tilelayer is changed, we need to redraw the layer
                        if (angular.isDefined(tiles.url) && angular.isDefined(tiles.options)){// && !angular.equals(tiles.options, tileLayerOptions)) {
                            map.removeLayer(tileLayerObj);

                            tileLayerOptions = defaults.tileLayerOptions;
                            angular.copy(tiles.options, tileLayerOptions);
                            tileLayerUrl = tiles.url;
                            tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                            tileLayerObj.addTo(map);
                            leafletData.setTiles(tileLayerObj);
                            return;

                            // Only the URL of the layer is changed, update the tiles object
                            if (angular.isDefined(tiles.url)) {
                                tileLayerObj.setUrl(tiles.url);
                            }
                        }
                    }else{

                        //leafletTiles object defined yet
                        if (angular.isDefined(tileLayerObj))
                            map.removeLayer(tileLayerObj);

                        if (angular.isDefined(tiles.layersGroup.Map) &&
                            angular.isDefined(tiles.layersGroup.Map.maxZoom) &&
                            angular.isDefined(tiles.layersGroup.Map.minZoom)) {

                            layertMap = L.tileLayer.chinaProvider(tiles.layersGroup.Map.name,
                                {
                                    maxZoom: tiles.layersGroup.Map.maxZoom,
                                    minZoom: tiles.layersGroup.Map.minZoom
                                }
                            );
                        }
                        if(angular.isDefined(tiles.layersGroup.Annotion) &&
                            angular.isDefined(tiles.layersGroup.Map.maxZoom) &&
                            angular.isDefined(tiles.layersGroup.Map.minZoom)){
                            layerAnnotion = L.tileLayer.chinaProvider(tiles.layersGroup.Annotion.name,
                                {
                                    maxZoom: tiles.layersGroup.Annotion.maxZoom,
                                    minZoom: tiles.layersGroup.Annotion.minZoom
                                }
                            );
                        }

                        //create layer group
                        layerGroup = [];
                        if(angular.isDefined(layertMap))
                            layerGroup.push(layertMap);
                        if(angular.isDefined(layerAnnotion))
                            layerGroup.push(layerAnnotion);

                        tileLayerObj = L.layerGroup(layerGroup);
                        tileLayerObj.addTo(map);
                        leafletData.setTiles(tileLayerObj);
                        return;
                    }
                };

                //call to switchTile on init to set the default tile.
                vm.switchTile(tiles);

                leafletScope.$on('$destroy', function(){
                    map = null;
                    controller.switchTile = null;
                });
            });
        };
    },
    controllerAs: 'layerSelectorCtrl'
});
