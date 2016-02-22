// demo app component comes here
var myApp = angular.module('leafletExtensionsDemo', ['ui-leaflet', 'ui-leaflet-layers-editor','ui-leaflet-layers-selector']);

/**
 * @ngdocs directive
 * @name leafletExtensionsDemoApp
 * @description "bootstraps" the demo app for the leaflet extensions
 *
 */

myApp.component('leafletExtensionsDemoApp', {
    template: '<leaflet lf-center="leafletExtensionsDemoAppCtrl.meta.center" \
        defaults="leafletExtensionsDemoAppCtrl.meta.defaults"\
        flex\
        height="100%">\
        <ui-layers-editor></ui-layers-editor>\
        <ui-leaflet-layers-selector \
        tiles-list="leafletExtensionsDemoAppCtrl.meta.tilesDict"\
        chinese-providers-tiles-list="leafletExtensionsDemoAppCtrl.meta.ChineseProviders"\
        default-tile="leafletExtensionsDemoAppCtrl.meta.defaultTile">\
        </ui-leaflet-layers-selector>\
        </leaflet>',
        controller: function leafletExtensionsDemoAppCtrl(demoService) {
        // get every change event in menu item
        this.changeDemoTemplate = (function changeDemoTemplate(newDemo, oldDemo) {
            this.template = newDemo.template;
            this.meta = newDemo.meta;
        }).bind(this);

        // set the default template for this demo
        this.changeDemoTemplate(demoService.Extensions.layersSelection);

        // listen to the change event
        demoService.addSelectDemoCallback(this.changeDemoTemplate);
    },
    controllerAs: 'leafletExtensionsDemoAppCtrl'
});

myApp.service('demoService', [function () {
    var selectDemoEvents = [];

    var data =
    {
        triggerSelectDemoEvent: function (newDemo) {
            for (var i = 0; i < selectDemoEvents.length; i++) {
                selectDemoEvents[i](newDemo, currentDemo);
            }
            currentDemo = newDemo;
        },
        addSelectDemoCallback: function (callback) {
            selectDemoEvents.push(callback);
        },
        Extensions: {
            layersSelection: {
                name: 'Layers Selection',
                template: 'leafletLayersSelector',
                meta: {
                    tilesDict: [
                        {
                            name: 'Street map - English',
                            url: "http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
                            options: {
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        },
                        {
                            name: 'Street map - localized language',
                            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            options: {
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        },
                        {
                            name: 'Satellite imagery',
                            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            type: 'xyz',
                            options: {
                                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            }
                        },
                        {
                            name: 'Transportation map',
                            url: 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
                            options: {
                                attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        }
                    ],
                    ChineseProviders:[
                        {
                            name: 'GaoDe.Normal',
                                layersGroup: {
                                    Map: {
                                         name: 'GaoDe.Normal.Map',
                                         maxZoom: 18,
                                         minZoom: 5
                                }
                            }
                        },
                        {
                            name:'GaoDe.Satellite',
                            layersGroup: {
                                Map:{
                                    name: 'GaoDe.Satellite.Map',
                                    maxZoom: 18,
                                    minZoom: 5
                                },
                                Annotion:{
                                    name: 'GaoDe.Satellite.Annotion',
                                    maxZoom: 18,
                                    minZoom: 5
                                }
                            }
                        },
                        {
                            name:'TianDiTu.Normal',
                            layersGroup: {
                                Map: {
                                    name: 'TianDiTu.Normal.Map',
                                    maxZoom: 18,
                                    minZoom: 5
                                },
                                Annotion: {
                                    name: 'TianDiTu.Normal.Annotion',
                                    maxZoom: 18,
                                    minZoom: 5
                                }
                            }
                        },
                        {
                            name:'TianDiTu.Satellite',
                            layersGroup: {
                                Map: {
                                    name: 'TianDiTu.Satellite.Map',
                                    maxZoom: 18,
                                    minZoom: 5
                                },
                                Annotion: {
                                    name: 'TianDiTu.Satellite.Annotion',
                                    maxZoom: 18,
                                    minZoom: 5
                                }
                            }
                        }
                    ],
                    center: {
                        lat: 31.59,
                        lng: 120.29,
                        zoom: 8
                    },
                    defaultTile: 0
                }
            },
            locationsEditor: {
                name: 'Locations Editor',
                template: 'leafletLocationsEditor'
            }
        }
    };

    // set the default demo - I know we shuold have used ui-route but seemed a bit overkill here...
    var currentDemo = data.Extensions.layersSelection;
    return data;
}]);
