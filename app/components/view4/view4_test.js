'use strict';

describe('myApp.view4 module', function () {

    var View4Ctrl;

    beforeEach(module('myApp.view4'));
    beforeEach(inject(function($controller,  $rootScope) {
        // Note the use of the $new() function
        var $scope = $rootScope.$new();

        // The new child scope is passed to the controller's constructor argument
        View4Ctrl = $controller('View4Ctrl', { $scope: $scope });
    }));

    describe('view4 controller', function () {
        it('should ....', inject(function () {
            //spec body
            expect(View4Ctrl).toBeDefined();
        }));
    });
});