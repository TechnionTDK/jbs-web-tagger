'use strict';

describe('myApp.view3 module', function () {

    var View3Ctrl;

    beforeEach(module('myApp.view3'));
    beforeEach(inject(function($controller,  $rootScope) {
        // Note the use of the $new() function
        var $scope = $rootScope.$new();

        // The new child scope is passed to the controller's constructor argument
        View3Ctrl = $controller('View3Ctrl', { $scope: $scope });
    }));

    describe('view3 controller', function () {
        it('should ....', inject(function () {
            //spec body
            expect(View3Ctrl).toBeDefined();
        }));
    });
});