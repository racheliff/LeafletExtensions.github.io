describe('Unit testing Layer Selector', function () {
    var $compile,
        $rootScope,
        element,
        uiLeafletModule;

    var $httpBackend;

    // Load the ui-leaflet-extensions module, which contains the directive
    beforeEach(function(){
        uiLeafletModule = angular.module('ui-leaflet', []); // mock the ui-leaflet module
        module('ui-leaflet-extensions');
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function (_$compile_, _$rootScope_, _$injector_) {
        // use httpBackend to accept template calls
        $httpBackend = _$injector_.get('$httpBackend');
        $httpBackend.whenGET( /^(.*\.(?=(htm|html|svg|js)$))?[^.]*$/i ).respond(200, '');

        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        $rootScope.layersSelectorData = {
            option1: {name: "option 1"},
            option2: {name: "option 2"}
        };
        $rootScope.currentTile = "option 1";
        // Compile a the component: ui-leaflet-layers-selector
        element = $compile('<ui-leaflet-layers-selector tilesList="layersSelectorData" currentTile="currentTile"></ui-leaflet-layers-selector>')($rootScope);
        // fire all the watches
        $rootScope.$digest();
    }));

    it('Replaces the element with the appropriate content', function () {

        //var item =
        // Check that the compiled element contains the templated content
        //expect(element.find('li').length).toBe(2);
    });
});

