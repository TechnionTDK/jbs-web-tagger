'use strict';

describe('myApp.view1 module', function () {

    var View1Ctrl;

    var uibModal;

    angular.mock.inject(function($uibModal){
        uibModal = $uibModal;
    });

    beforeEach(module('ngRoute'));
    beforeEach(module('myApp.view1'));
    beforeEach(inject(function($controller, $rootScope) {
        // Note the use of the $new() function
        var $scope = $rootScope.$new();

        // The new child scope is passed to the controller's constructor argument
        View1Ctrl = $controller('View1Ctrl', { $scope: $scope, $uibModal: uibModal });
    }));

    describe('view1 controller', function () {
        it('should ....', inject(function () {
            //spec body
            expect(View1Ctrl).toBeDefined();
        }));
    });
});