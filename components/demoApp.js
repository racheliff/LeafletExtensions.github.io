// demo app component comes here
var myApp = angular.module('leafletExtensionsDemo', ['ui-leaflet', 'ui-leaflet-extensions']);

/**
 * @ngdocs directive
 * @name leafletExtensionsDemoApp
 * @description "bootstraps" the demo app for the leaflet extensions
 *
 */

myApp.component('leafletExtensionsDemoApp', {
    template: '<div id="demoWrapper" layout="row" flex>\
    <demo-menu flex="15"></demo-menu>\
    <demo-content layout="row" flex></demo-content>\
    </div>',
    controller: function leafletExtensionsDemoAppCtrl() {
    },
    controllerAs: 'leafletExtensionsDemoAppCtrl'
});

// this would show a list of extensions to show off
myApp.component('demoMenu', {
    template: '<md-sidenav flex="20" class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="true">\
    <md-toolbar class="md-theme-indigo">\
    <h1 class="md-toolbar-tools">Extensions</h1>\
    </md-toolbar>\
    <md-list>\
    <md-list-item class="list-item-extension" ng-repeat="item in demoMenuCtrl.items"\
                    ng-click="demoMenuCtrl.selectExtension(item)">\
    {{item.name}}\
    </md-list-item>\
    </md-list>\
    </md-sidenav>',
    controller: function demoMenuCtrl(demoService) {
        this.items = demoService.Extensions;

        // add a method that changes the demoContentCtrl -> this.contentCtrl.template...
        this.selectExtension = function (selectedDemo) {
            demoService.triggerSelectDemoEvent(selectedDemo);
        }
    },
    controllerAs: 'demoMenuCtrl'
});

// this would change according to the content chosen in the menu
myApp.component('demoContent', {
    template: '<md-content flex layout="row">\
    <div ng-include="demoContentCtrl.template" layout="column" flex></div>\
    </md-content>',
    controllerAs: 'demoContentCtrl',
    controller: function (demoService) {

        // get every change event in menu item
        this.changeDemoTemplate = (function changeDemoTemplate(newDemo, oldDemo) {
            this.template = newDemo.template;
            this.meta = newDemo.meta;
        }).bind(this);

        // set the default template for this demo
        this.changeDemoTemplate(demoService.Extensions.layersSelection);

        // listen to the change event
        demoService.addSelectDemoCallback(this.changeDemoTemplate);
    }
});

myApp.run(['$templateCache', function ($templateCache) {
    $templateCache.put('leafletLayersSelector', '<leaflet lf-center="demoContentCtrl.meta.center" \
        tiles="demoContentCtrl.meta.tilesDict[demoContentCtrl.meta.tiles]"\
        defaults="demoContentCtrl.meta.defaults"\
        flex\
        height="100%">\
        <ui-leaflet-layers-selector \
        tiles-list="demoContentCtrl.meta.tilesDict">\
        </ui-leaflet-layers-selector>\
        </leaflet>');

    $templateCache.put('leafletLocationsEditor', '<div>leafletLocationsEditor</div>');

}]);

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
                    tilesDict: {
                        OpenStreetMap_DE: {
                            name: 'Street map - localized language',
                            url: "http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
                            options: {
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        },
                        OpenStreetMap_Mapnik: {
                            name: 'Street map - English',
                            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            options: {
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        },
                        Esri_WorldImagery: {
                            name: 'Satellite imagery',
                            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            type: 'xyz',
                            options: {
                                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            }
                        },
                        Thunderforest_Transport: {
                            name: 'Transportation map',
                            url: 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
                            options: {
                                attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }
                        }
                    },
                    center: {
                        lat: 51.505,
                        lng: -0.09,
                        zoom: 8
                    },
                    tiles: 'OpenStreetMap_DE'
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
