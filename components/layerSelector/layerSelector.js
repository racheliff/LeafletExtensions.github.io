var extensionApp = angular.module('ui-leaflet-extensions', ['ui-leaflet']);

extensionApp.component('uiLeafletLayersSelector', {
    templateUrl: 'components/layerSelector/index.tmpl.html',
    bindings: {
        tilesList: '=',
    },
    require: {
        leaflet: '^leaflet'
    },
    controller: function layerSelectorCtrl($scope) {
        this.show = true;
        this.selectVal = function (item) {
            this.leaflet.getLeafletScope().tiles = item;
        };
        this.$onInit = function() {
            console.log(this.leaflet);
        };
    },
    controllerAs: 'layerSelectorCtrl'

});
